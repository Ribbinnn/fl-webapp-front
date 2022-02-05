import React from "react";
 import { Image, Button, Row, Col, label } from "antd";

 export default function PageNotFound () {
     return (
     <div className="content">
         <Row align="middle" style={{ height: "100%" }}>
         <Col span={12} align="middle">
             <Image src="/logos/DeepMed Logo with Steth.png" height={400} preview={false}/>
         </Col>
         <Col span={12} align="middle">
             <div>
             <label style={{fontSize: "100px", fontWeight: "bold"}}>404</label>
             <label style={{fontSize: "40px", fontWeight: "bold"}}>Sorry, Page Not Found</label>
             <label style={{marginBottom: "20px"}}>The page you are looking for does not exist.</label><br/>
             <a href="/"><Button className="primary-btn">Go to Home Page</Button></a>
             </div>
         </Col>
         </Row>
     </div>
     )
 }