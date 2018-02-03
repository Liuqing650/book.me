import React from 'react';
import styles from './index.less';

const SideTool = ({
  scale,
  onClick,
}) => {
  const handleClick = (even) => {
    onClick(even);
  };
  return (
    <div className={styles.toolWrap}>
      <div className={`clearfix ${styles.box}`}>
        <div className={styles.zoomContent}>
          <p onClick={() => handleClick('add')}><i className="fa fa-plus"></i></p>
          <p className={styles.zoomText}>{`${scale}%`}</p>
          <p onClick={() => handleClick('sub')}><i className="fa fa-minus"></i></p>
        </div>
        <div className={styles.toolBtn} onClick={() => handleClick('download')}><i className={styles.downloadIcon}></i></div>
      </div>
    </div>
  );
};
export default SideTool;

















@color: #42a5f5;
.unselect() {
  -moz-user-select: none;
  -o-user-select:none;
  -khtml-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
.boxWrap {
  width: 50px;
  text-align: center;
  border: 1px solid #eeeeee;
}
.chartWrap {
  border: none;
  cursor: pointer;
}
.toolWrap {
  position: absolute;
  z-index: 1000;
  top: 200px;
  right: 50px;
  .box {
    .unselect();
    .toolBtn {
      .boxWrap;
      height: 50px;
      margin-top: 10px;
      cursor: pointer;
      &:hover {
        border-color: @color;
      }
      transition: border-color 0.3s;
      i {
        display: inline-block;
        width: 32px;
        height: 32px;
        line-height: 32px;
        vertical-align: text-top;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        color: #42a5f5;
      }
      .downloadIcon {
        background-image: url(imgs/bannerInfo/download.png);
      }
    }
    .zoomContent {
      .boxWrap;
      padding: 10px 0;
      color: #42a5f5;
      i {
        text-align: center;
        font-size: 20px;
        cursor: pointer;
      }
      p {
        text-align: center;
        font-size: 12px;
      }
      .zoomText {
        margin: 10px 0;
      }
    }
  }
}