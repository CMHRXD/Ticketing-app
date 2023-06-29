import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import useAuthRequest from "../hooks/useAuthRequest";
import useUsers from "../hooks/useUsers";
import ticketImg from "../assets/ticket.svg";
import { classNameJoin as classNames } from "../helpers/classNameJoin" ;

const Nav = () => {
  const [navigation, setNavigation] = useState([
    { name: "Home", href: "/app/home", current: true },
    { name: "Sell Tickets", href: "/app/ticket-form", current: false },
    { name: "My Orders", href: "/app/orders-list", current: false },
  ]);
  const { setUser } = useUsers(); 
  const {authRequest} = useAuthRequest({
    url: "/users/sign-out",
    method: "post",
    body: {},
    onSuccess: () => {
      setUser({});
    }
  });


  const user = {
    name: "Tom Cook",
    email: "tom@example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };

  const userNavigation = [
    { name: "Your Profile", href: "#", action: () => swal("Info", "Action in development", "info") },
    { name: "Settings", href: "#", action: () => swal("Info", "Action in development", "info")},
    { name: "Sign out", href: "/sign-in", action: () => authRequest() },
  ];

  return (
    <Disclosure as="nav" className="bg-blue-500">
      {({ open }) => (
        <>
          <div className="mx-10">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-10' w-10 text-white rounded-full"
                    src={ticketImg}
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <Link
                        to={item.href}
                        key={item.name}
                        className={classNames(
                          item.current
                            ? "bg-white text-gray-900"
                            : "text-gray-100 hover:bg-gray-900 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        onClick={() => {
                          setNavigation(
                            navigation.map((i) => {
                              i.current = false;
                              if (i.name === item.name) {
                                i.current = true;
                              }
                              return i;
                            })
                          );
                        }}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="rounded-full bg-white p-1 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500 duration-300"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon
                      className="h-6 w-6 text-blue-500 bg-white rounded-full"
                      aria-hidden="true"
                    />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                to={item.href}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                                onClick={item.action}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-800 duration-300">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon
                      className="block h-6 w-6 text-black bg-white"
                      aria-hidden="true"
                    />
                  ) : (
                    <Bars3Icon
                      className="block h-6 w-6 text-black bg-white"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "bg-white text-gray-900"
                      : "text-gray-100 hover:bg-gray-900 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  onClick={() => {
                    setNavigation(
                      navigation.map((i) => {
                        i.current = false;
                        if (i.name === item.name) {
                          i.current = true;
                        }
                        return i;
                      })
                    );
                  }}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.imageUrl}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className=" text-lg font-medium leading-none text-white">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-100">
                    {user.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-blue-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500 duration-300"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon
                    className="h-6 w-6 text-blue-500 bg-white rounded-full"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-900 hover:text-white"
                    onClick={item.action}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Nav;
