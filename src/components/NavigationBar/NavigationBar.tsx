import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavigationBar.module.css";
import {
  FaArrowAltCircleLeft,
  FaArrowDown,
  FaArrowLeft,
  FaBackward,
  FaBars,
  FaBookmark,
  FaEye,
  FaHeart,
  FaHome,
  FaInternetExplorer,
  FaPlus,
  FaRegBookmark,
  FaRegHeart,
  FaRegTimesCircle,
  FaRegUser,
  FaSearch,
  FaTimes,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";
import {
  FaCircleInfo,
  FaExplosion,
  FaMessage,
  FaPerson,
} from "react-icons/fa6";
import { CgLogOut } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { toggleNavigationBar } from "../../redux/navigationBarSlice";
import { Home, MessageCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isSidebarVisible = useSelector(
    (state: RootState) => state.sidebar.isVisible
  );

  const logoutHnadler = async () => {
    const token = localStorage.getItem("instagram_user");
    const cleanedUser = token;
    console.log(token);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.post("http://172.50.5.102:3011/auth/logout", {
      headers,
    });
    if (res.status === 201) {
      localStorage.clear();
      window.location.reload();
    }
  };
  return (
    <div className={styles.outer}>
      <div className={isSidebarVisible ? styles.main : styles.hideMain}>
        <div className={styles.backs}>
          <h2 className={styles.heading}>Instagram</h2>
          <FaRegTimesCircle
            className={styles.back}
            onClick={() => dispatch(toggleNavigationBar())}
          />
        </div>
        <h2 className={styles.heading2}>In</h2>
        <ul className={styles.list}>
          <li className={styles.list_li}>
            <NavLink to="/" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <Home className={styles.icon} />
                  <p className={styles.head}> Home</p>
                </div>
                <p className={styles.val}>new post</p>
              </div>
            </NavLink>
          </li>
          <li className={styles.list_li}>
            <NavLink to="/explore" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <FaSearch className={styles.icon} />
                  <p className={styles.head}> Search</p>
                </div>
                <p className={styles.val}>{"Explore"}</p>
              </div>
            </NavLink>
          </li>{" "}
          {/* <li className={styles.list_li}>
            <NavLink to="/" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <FaEye className={styles.icon} />
                  <p className={styles.head}> Explore</p>
                </div>
                <p className={styles.val}>suggestion</p>
              </div>
            </NavLink>
          </li>{" "} */}
          <li className={styles.list_li}>
            <NavLink to="/create" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <FaPlus className={styles.icon} />
                  <p className={styles.head}> Create Post</p>
                </div>
                <p className={styles.val}>25</p>
              </div>
            </NavLink>
          </li>{" "}
          <li className={styles.list_li}>
            <NavLink to="/chat" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <MessageCircle className={styles.icon} />
                  <p className={styles.head}> Message</p>
                </div>
                <p className={styles.val}>25</p>
              </div>
            </NavLink>
          </li>{" "}
          <li className={styles.list_li}>
            <NavLink to="/noti" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <FaRegHeart className={styles.icon} />
                  <p className={styles.head}> Notification</p>
                </div>
                <p className={styles.val}>5 not..</p>
              </div>
            </NavLink>
          </li>{" "}
          <li className={styles.list_li}>
            <NavLink to="/" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <FaRegBookmark className={styles.icon} />
                  <p className={styles.head}> Bookmark</p>
                </div>
                <p className={styles.val}>99+</p>
              </div>
            </NavLink>
          </li>
          <li className={styles.list_li}>
            <NavLink to="/" className={styles.link}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <FaRegUser className={styles.icon} />
                  <p className={styles.head}> Profile</p>
                </div>
                {/* <p className={styles.val}>10</p> */}
              </div>
            </NavLink>
          </li>
          <li className={styles.list_li}>
            <NavLink to="/" className={styles.link} onClick={logoutHnadler}>
              <div className={styles.tile}>
                <div className={styles.name}>
                  <CgLogOut className={styles.icon} />
                  <p className={styles.head}> Logout</p>
                </div>
                {/* <p className={styles.val}>10</p> */}
              </div>
            </NavLink>
          </li>
        </ul>
        <div className={styles.space}></div>
        <div className={styles.bottom}>
          {" "}
          <div className={styles.tile}>
            <div className={styles.name}>
              <FaCircleInfo className={styles.icon} />
              <p className={styles.head}> Help</p>
            </div>
            {/* <p className={styles.val}>10</p> */}
          </div>{" "}
          <div className={styles.tile}>
            <div className={styles.name}>
              <FaBars className={styles.icon} />
              <p className={styles.head}> More</p>
            </div>
            {/* <p className={styles.val}>10</p> */}
          </div>
        </div>
      </div>
      {!isSidebarVisible && (
        <div className={styles.topbar}>
          <FaBars
            className={styles.menu}
            onClick={() => dispatch(toggleNavigationBar())}
          />{" "}
          <h2 className={styles.heading}>Instagram</h2>
          <FaRegHeart className={styles.menu} />
        </div>
      )}
    </div>
  );
}

export default NavigationBar;
