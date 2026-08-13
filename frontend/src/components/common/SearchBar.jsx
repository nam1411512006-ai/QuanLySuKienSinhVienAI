import { FaSearch } from "react-icons/fa";
import "../../assets/css/search.css";

const SearchBar = () => {
    return (
        <div className="home-search">

            <FaSearch className="home-search-icon" />

            <input
                className="home-search-input"
                type="text"
                placeholder="Tìm kiếm sự kiện..."
            />

        </div>
    );
};

export default SearchBar;