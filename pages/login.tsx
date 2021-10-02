import type { NextPage, GetStaticProps } from "next";
import { Container, Button } from "@chakra-ui/react";

const Login: NextPage = () => {
  return (
    <Container>
      Trang đăng nhập
      <br />
      <Button>Đăng nhập</Button>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      noLayout: true,
    },
  };
};

export default Login;
