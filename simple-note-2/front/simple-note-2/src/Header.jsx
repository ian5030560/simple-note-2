import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Menu>
      <Menu.Item as={Link} to="/">
        SimpleNote2
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item as={Link} to="/signin">
          註冊/登入
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}

export default Header;
