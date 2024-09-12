import "./Sidebar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
// import { TreeView, TreeItem } from "@mui/lab";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import {
  RateReview,
  People,
  Dashboard,
  ListAlt,
  ImportExport,
  Add,
  PostAdd,
  ExpandMore,
  ChevronRight,
} from "@mui/icons-material";
function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
      <Link to="/admin/dashboard">
        <p>
          <Dashboard /> Dashboard
        </p>
      </Link>
      <Link>
        <SimpleTreeView
          slots={{ expandIcon: ImportExport, collapseIcon: ExpandMore }}
        >
          <TreeItem itemId="1" label="Products">
            <Link to="/admin/products">
              <TreeItem itemId="2" label="All" slots={{ icon: PostAdd }} />
            </Link>

            <Link to="/admin/product">
              <TreeItem itemId="3" label="Create" slots={{ icon: Add }} />
            </Link>
          </TreeItem>
        </SimpleTreeView>
      </Link>
      <Link to="/admin/orders">
        <p>
          <ListAlt />
          Orders
        </p>
      </Link>
      <Link to="/admin/users">
        <p>
          <People /> Users
        </p>
      </Link>
      <Link to="/admin/reviews">
        <p>
          <RateReview />
          Reviews
        </p>
      </Link>
    </div>
  );
}

export default Sidebar;
