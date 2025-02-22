import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { TextField, Button, CircularProgress, Card, CardContent, Grid, Typography } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { debounce } from "lodash";



const SearchComponent = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // API Call Function
    const searchMedia = async (searchQuery, pageNumber = 1) => {
        if (!searchQuery) return;
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/search?q=${searchQuery}&page=${pageNumber}`);
            if (pageNumber === 1) {
                setResults(response.data.results);
            } else {
                setResults((prev) => [...prev, ...response.data.results]);
            }
            setHasMore(response.data.results.length > 0);
        } catch (err) {
            setError("Error fetching data");
        }

        setLoading(false);
    };

    // Debounce Search Input
    const debouncedSearch = useCallback(
        debounce((searchQuery) => {
            searchMedia(searchQuery);
        }, 500),
        []
    );

    // Handle Search Input Changes
    const handleSearchChange = (e) => {
        setQuery(e.target.value);
        setPage(1);
        debouncedSearch(e.target.value);
    };

    // Format Results
    const memoizedResults = useMemo(() => {
        return results.map((item) => ({
            ...item,
            imageUrl: `https://cdn.imago-images.com/bild/st/${item.bildnummer?.padStart(10, '0')}/m.jpg`,
        }));
    }, [results]);

    return (
        <div style={{ textAlign: "center", padding: "20px", maxWidth: "1200px", margin: "auto" }}>
            {/* Title */}
            <Typography variant="h3" sx={{ fontWeight: "bold", letterSpacing: "2px", marginBottom: "10px" }}>
                IMAGO
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: "20px", fontWeight: 500 }}>
                Search for Media
            </Typography>

            {/* Search Bar with Better Styling */}
            <TextField
                variant="outlined"
                placeholder="Enter keyword..."
                value={query}
                onChange={handleSearchChange}
                sx={{
                    width: "50%", // Smaller search bar
                    minWidth: "300px",
                    marginBottom: "20px",
                }}
            />

            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}

            {/* Responsive Grid Layout */}
            <Grid container spacing={3} justifyContent="center">
                {memoizedResults.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={item.bildnummer || index}>  
                        <Card sx={{ boxShadow: 3, borderRadius: "10px", padding: "10px" }}>
                            <CardContent>
                                {/* Improved Title Formatting */}
                                <Typography variant="h6" align="center" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
                                    {item.suchtext}
                                </Typography>
                                <Typography variant="subtitle2" color="textSecondary" align="center">
                                    {item.bildnummer}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" align="center">
                                    Photographer: {item.fotografen || "Unknown"}
                                </Typography>
                                <LazyLoadImage
                                    src={item.imageUrl}
                                    alt="Media"
                                    width="100%"
                                    effect="blur"
                                    onError={(e) => { 
                                        e.target.onerror = null; 
                                        e.target.src = "https://via.placeholder.com/300";  
                                    }}
                                    style={{ borderRadius: "8px", marginTop: "10px", maxHeight: "250px", objectFit: "cover" }} // Ensuring images stay large enough
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Load More Button */}
            {hasMore && (
                <Button 
                    variant="contained" 
                    sx={{ marginTop: "20px" }}
                    onClick={() => {
                        setPage(page + 1);
                        searchMedia(query, page + 1);
                    }}
                >
                    Load More
                </Button>
            )}
        </div>
    );
};

export default SearchComponent;
