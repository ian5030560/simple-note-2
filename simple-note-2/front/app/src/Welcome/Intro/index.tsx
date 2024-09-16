import React from "react";
import { Carousel, Flex, theme } from "antd";

const contentStyle: React.CSSProperties = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

const Intro = () => {
    const { token } = theme.useToken();
    const onChange = (currentSlide: number) => {
        console.log(currentSlide);
    };

    return <Flex style={{maxWidth: "100%"}}>
        {/* <Carousel afterChange={onChange} arrows style={{maxWidth: "100%"}}>
            <div>
                <h3>1</h3>
            </div>
            <div>
                <h3>2</h3>
            </div>
        </Carousel> */}
        <></>
    </Flex>
}

export default Intro