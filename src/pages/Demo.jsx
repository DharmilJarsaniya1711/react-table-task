import { useEffect, useRef, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { CircularProgress, Grid, TextField } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";

import axios from "axios";

export default function Demo() {
  const searchInputRef = useRef(null);

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const options = {
        method: "GET",
        url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
        params: {
          countryIds: "IN",
          namePrefix: search,
          limit: rowsPerPage,
          offset: page * rowsPerPage,
        },
        headers: {
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
          "x-rapidapi-key":
            "0313ac4a03msh007ba5bbb9faf79p148527jsnef99ea4653d4",
        },
      };

      const response = await axios.request(options);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [rowsPerPage, page]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        console.log("first");
        searchInputRef.current.focus();
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      fetchData();
    }
  };
  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      fetchData();
    }
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            value={search}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            placeholder="Search places..."
            className="search-field"
            inputProps={{ ref: searchInputRef }}
            InputProps={{
              endAdornment: <div className="search-control">Ctrl + /</div>,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650, minHeight: 350 }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="left">#</TableCell>
                  <TableCell align="left">Place name</TableCell>
                  <TableCell align="left">Country</TableCell>
                </TableRow>
              </TableHead>

              {loading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {data?.data?.length > 0 ? (
                    data.data.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell align="left">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.country}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No Record Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          {data?.metadata?.totalCount > 0 && (
            <TablePagination
              component="div"
              showFirstButton
              showLastButton
              count={data.metadata.totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10]}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
