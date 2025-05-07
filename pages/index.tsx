import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import NavBar from "../components/NavBar";
import HomePage from "../components/homePage";
import Model_Eyes from "../components/Model_eyes";

import Footer from "../components/Footer";

const Home: NextPage = () => {
  return (
    <div>
      <main>
        <Box as="main">
          <NavBar />
          <HomePage />

          <br />
          <div className="content-container">
            <div className="header-container">
              <div className="line left-line"></div>
              <h2 className="header-title">Đăng ký nhận bản tin điện tử</h2>
              <div className="line right-line"></div>
            </div>
            <p className="info-text">
              Đăng ký nhận E-NewsLetter để cập nhật thông tin mới nhất và ưu đãi
              từ chúng tôi.
            </p>
            <br />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "Arial",
            }}
          >
            <div
              style={{
                margin: "0 10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "10px 20px",
                outline: "none",
              }}
            >
              <input type="email" value="your-email@gmail.com" />
            </div>
            <div
              style={{
                margin: "0 10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "10px 20px",
                outline: "none",
              }}
            >
              <span>Hot News in Viet Nam</span>
            </div>
            <button className="button-register">Sign up</button>
          </div>
          <br />
          <Footer />
        </Box>
      </main>
    </div>
  );
};

export default Home;
