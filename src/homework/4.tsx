import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  ReactNode,
} from "react";
import noop from "lodash/noop";

type MenuIds = "first" | "second" | "last";
type Menu = { id: MenuIds; title: string };

type SelectedMenu = { id: MenuIds };
type MenuSelected = { selectedMenu: SelectedMenu };
type MenuAction = { onSelectedMenu: (selectedMenu: SelectedMenu) => void };

type PropsMenu = {
  menus: Menu[];
};

const MenuSelectedContext = createContext<MenuSelected>({
  selectedMenu: {} as SelectedMenu,
});

const MenuActionContext = createContext<MenuAction>({
  onSelectedMenu: noop,
});

type PropsProvider = {
  children: ReactNode;
};

const MenuProvider = ({ children }: PropsProvider) => {
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>(
    {} as SelectedMenu
  );

  const menuContextAction = useMemo(
    () => ({
      onSelectedMenu: setSelectedMenu,
    }),
    []
  );

  const menuContextSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
};

const MenuComponent = ({ menus }: PropsMenu) => {
  const { onSelectedMenu } = useContext(MenuActionContext);
  const { selectedMenu } = useContext(MenuSelectedContext);

  return (
    <>
      {menus.map((menu) => (
        <div key={menu.id} onClick={() => onSelectedMenu({ id: menu.id })}>
          {menu.title}{" "}
          {selectedMenu.id === menu.id ? "Selected" : "Not selected"}
        </div>
      ))}
    </>
  );
};

export const ComponentApp = () => {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
};
