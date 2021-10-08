import type { NextPage, GetStaticProps } from "next";
import { Container, Button } from "@chakra-ui/react";
import { useMutation } from "react-query";

import { useUser } from "context/UserProvider";
import { doLogin } from "services/auth";

const Login: NextPage = () => {
  const { mutate } = useMutation({
    mutationKey: "login",
    mutationFn: doLogin,
  });

  const { visitorId, platform } = useUser();

  return (
    <Container>
      Trang đăng nhập
      <br />
      Device ID: {visitorId} on {platform}
      <br />
      <Button
        onClick={() =>
          mutate({
            username: "",
            password: "",
            deviceModel: platform,
            fcm: visitorId,
          })
        }
      >
        Đăng nhập
      </Button>
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
