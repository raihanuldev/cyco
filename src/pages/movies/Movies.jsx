import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Loading from '../../components/loading/Loading';
import MovieCard from "../../components/movieCard/MovieCard";

import useMovies from '../../hooks/useMovies';
import Pagination from "../../components/paginaition/Pagination";

const Movies = () => {
  const [movies, loading] = useMovies();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredMovies, setFilteredMovies] = useState([]); // State for filtered movies
  const [isSearchClicked, setIsSearchClicked] = useState(false); // State to track whether the search button is clicked
  const moviesPerPage = 12;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleNumberClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const searchHandle = async () => {
    setCurrentPage(1);
    setIsSearchClicked(true); 
    const moviesMatchingSearch = movies.filter(movie =>
      movie.Title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMovies(moviesMatchingSearch);
  };

  if (loading) {
    return <Loading />;
  }

  if (!Array.isArray(movies)) {
    return <div>Error: Movies data is not an array.</div>;
  }

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 justify-center">
        <input
          type="search"
          className="rounded-full px-3 py-2 w-[30%]"
          placeholder="Search movies"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <FaSearch size={22} onClick={searchHandle} />
      </div>

      <div className="mt-10 w-full flex justify-center flex-wrap gap-1">
        {(isSearchClicked && filteredMovies.length === 0) 
          ? <div>No results found.</div>
          : (searchQuery && isSearchClicked) 
              ? filteredMovies
                  .slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage)
                  .map((movie, index) => (
                    <MovieCard key={index} movie={movie}></MovieCard>
                  ))
              : movies 
                  .slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage)
                  .map((movie, index) => (
                    <MovieCard key={index} movie={movie}></MovieCard>
                  ))}
      </div>

      {/* Pagination */}
      {(isSearchClicked && filteredMovies.length > 0) || (!isSearchClicked && movies.length > 0)
        ? (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil((isSearchClicked ? filteredMovies : movies).length / moviesPerPage)}
            onPageChange={handlePageChange}
            onNumberClick={handleNumberClick}
          />
        )
        : null}
    </div>
  );
};

export default Movies;



// import { useEffect, useState } from "react";
// import { FaSearch } from "react-icons/fa";
// import Loading from '../../components/loading/Loading';
// import MovieCard from "../../components/movieCard/MovieCard";
// import Pagination from "../../components/paginaition/Pagination";
// import useMovies from '../../hooks/useMovies';

// const Movies = () => {
//   const [movies, loading] = useMovies()
//   const [currentPage, setCurrentPage] = useState(1);
//   const moviesPerPage = 12;

//   // const [movies, loading, refetch] = useMovies()
//   // const movies = useMovies()

//   // const [movies, setMovies] = useState([]);

//   // useEffect(()=>{
//   //   const fetchedMovies = async ()=>{
//   //     const data = await useMovies();
//   //     setMovies(data)
//   //   }
//   //   fetchedMovies()
//   // },[])


//   const totalPages = 10;

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };
//   const handleNumberClick = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };
//   // useEffect(() => {
//   //   fetch("MoviesWithDetails.json")
//   //     .then((res) => res.json())
//   //     .then((data) => setMovies(data));
//   // });
//   // there will be spinner



//   if (loading) {
//     // You can display a loading indicator here
//     return <Loading />;
//   }
//   if (!Array.isArray(movies)) {
//     return <div>Error: Movies data is not an array.</div>;
//   }

//   return (
//     <div className="mt-10">
//      <div className="flex items-center gap-3 justify-center">
//         <input
//           type="search"
//           className="rounded-full px-3 py-2 w-[30%]"
//           placeholder="Search movies"
//         />
//         <FaSearch size={22}/>
//       </div>

//       {movies && Array.isArray(movies) ? (
//   <div className="mt-10 w-full flex justify-center flex-wrap gap-1">


//       {/* <div className="mt-10 w-full flex justify-center flex-wrap gap-1">
//         {movies
//           .slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage)
//           .map((movie, index) => (
//             <MovieCard key={index} movie={movie}></MovieCard>
//           ))}
//       </div> */}

//       {/* Pagination */}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={Math.ceil(movies.length / moviesPerPage)}
//         onPageChange={handlePageChange}
//         onNumberClick={handleNumberClick}
//       />
//     </div>
//   );
// };

// export default Movies;
