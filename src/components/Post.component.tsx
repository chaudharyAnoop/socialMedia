import React, { useState } from "react";
import styles from "../styles/Post.module.css";
import { FaHeart, FaRegBookmark, FaTimes } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import { FaRegMessage } from "react-icons/fa6";
import { MessageCircle, Send } from "lucide-react";

interface CircularImageProps {
  imgUrl: string;
  alt?: string;
  body: string;
  title: string;
  likecount: string;
}

export default function Post({
  imgUrl,
  alt,
  body,
  title,
  likecount,
}: CircularImageProps) {
  const txt = `Wow, this looks amazing! 😍 Keep shining! ✨ #Inspo dashbdgb dajdas dbjasbdas dhasvdbas dbhasvd asdbva sd dbausd asjdas dbsad asdasdb asdabsd asbd asbd anbs dasd had sad `;
  const [isOpen, setIsOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Handle image load error
  const handleImageError = () => {
    setIsImageLoading(false); // Optionally handle error state
    console.error("Failed to load image");
  };
  return (
    <div className={styles.main}>
      <div className={styles.data}>
        <div className={styles.title}>
          <img src="/dp1.jpg" className={styles.dp}></img>
          <p className={styles.t1}>{title}</p>
        </div>
        <p className={styles.t2}>2 hours ago</p>
      </div>

      {isImageLoading && (
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <img
        src={imgUrl}
        alt={alt}
        className={`${styles.img} ${isImageLoading ? styles.hidden : ""}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      <div className={styles.likes}>
        <div className={styles.interactions}>
          <FaHeart className={styles.icon} />
          <MessageCircle className={styles.icon} />
          <Send className={styles.icon} />
        </div>
        <FaRegBookmark className={styles.icon} />
      </div>
      <div className={styles.likecountdiv}>
        <p className={styles.likecount}>{likecount} Likes</p>
      </div>

      <p className={styles.desc}>{body}</p>
      <div className={styles.likecountdiv}>
        <p
          className={styles.commentcount}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          View all 68 comments
        </p>
      </div>
      <div className={styles.inputs}>
        <input className={styles.input} placeholder="Add a comment"></input>
        <button className={styles.post}>Post</button>
      </div>
      {isOpen && (
        <div className={styles.main_comments}>
          <div className={styles.close}>
            <FaTimes
              className={styles.closeicon}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />
          </div>
          <div className={styles.comment_div}>
            <div className={styles.comment_img}>
              <img
                src={imgUrl}
                alt={alt}
                className={styles.commentimg}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
            <div className={styles.comments}>
              {" "}
              <div className={styles.data}>
                <div className={styles.title}>
                  <img src="/dp1.jpg" className={styles.dp}></img>
                  <p className={styles.t1}>{title}</p>
                </div>
                <p className={styles.t2}>2 hours ago</p>
              </div>
              <div className={styles.allcomments}>
                <div className={styles.commentcard}>
                  <p className={styles.avatar}>A</p>
                  <div className={styles.commentdata}>
                    <p className={styles.commentuser}>Anoop Kumar Chaudhary</p>
                    <p className={styles.commentvalue}>{txt}</p>
                  </div>
                </div>
                <div className={styles.commentcard}>
                  <p className={styles.avatar}>A</p>
                  <div className={styles.commentdata}>
                    <p className={styles.commentuser}>Anoop Kumar Chaudhary</p>
                    <p className={styles.commentvalue}>{txt}</p>
                  </div>
                </div>{" "}
                <div className={styles.commentcard}>
                  <p className={styles.avatar}>A</p>
                  <div className={styles.commentdata}>
                    <p className={styles.commentuser}>Anoop Kumar Chaudhary</p>
                    <p className={styles.commentvalue}>{txt}</p>
                  </div>
                </div>{" "}
                <div className={styles.commentcard}>
                  <p className={styles.avatar}>A</p>
                  <div className={styles.commentdata}>
                    <p className={styles.commentuser}>Anoop Kumar Chaudhary</p>
                    <p className={styles.commentvalue}>{txt}</p>
                  </div>
                </div>{" "}
                <div className={styles.commentcard}>
                  <p className={styles.avatar}>A</p>
                  <div className={styles.commentdata}>
                    <p className={styles.commentuser}>Anoop Kumar Chaudhary</p>
                    <p className={styles.commentvalue}>{txt}</p>
                  </div>
                </div>{" "}
                <div className={styles.commentcard}>
                  <p className={styles.avatar}>A</p>
                  <div className={styles.commentdata}>
                    <p className={styles.commentuser}>Anoop Kumar Chaudhary</p>
                    <p className={styles.commentvalue}>{txt}</p>
                  </div>
                </div>{" "}
                <div className={styles.commentcard}>
                  <p className={styles.avatar}>A</p>
                  <div className={styles.commentdata}>
                    <p className={styles.commentuser}>Anoop Kumar Chaudhary</p>
                    <p className={styles.commentvalue}>{txt}</p>
                  </div>
                </div>{" "}
                <div className={styles.commentcard}>
                  <p className={styles.avatar}>A</p>
                  <div className={styles.commentdata}>
                    <p className={styles.commentuser}>Anoop Kumar Chaudhary</p>
                    <p className={styles.commentvalue}>{txt}</p>
                  </div>
                </div>{" "}
                <div className={styles.commentcard}>
                  <p className={styles.avatar}>A</p>
                  <div className={styles.commentdata}>
                    <p className={styles.commentuser}>Anoop Kumar Chaudhary</p>
                    <p className={styles.commentvalue}>{txt}</p>
                  </div>
                </div>{" "}
                <div className={styles.commentcard}>
                  <p className={styles.avatar}>A</p>
                  <div className={styles.commentdata}>
                    <p className={styles.commentuser}>Anoop Kumar Chaudhary</p>
                    <p className={styles.commentvalue}>{txt}</p>
                  </div>
                </div>
              </div>{" "}
              <div className={styles.likes}>
                <div className={styles.interactions}>
                  <FaHeart className={styles.icon} />
                  <MessageCircle className={styles.icon} />
                  <Send className={styles.icon} />
                </div>
                <FaRegBookmark className={styles.icon} />
              </div>
              <div className={styles.inputs}>
                <input
                  className={styles.input2}
                  placeholder="Post a comment"
                ></input>
                <button className={styles.post_button}>Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
