import { createHashRouter } from "react-router-dom";

import { MainContentWrap } from "@/layout/MainContentWrap";
import { EmptyChat } from "@/pages/chat/EmptyChat";
import { QueryChat } from "@/pages/chat/queryChat";

import contactRoutes from "./contactRoutes";

const router = createHashRouter([
  {
    path: "/",
    element: <MainContentWrap />,
    children: [
      {
        path: "/",
        async lazy() {
          const { MainContentLayout } = await import("@/layout/MainContentLayout");
          return {
            Component: MainContentLayout,
          };
        },
        children: [
          {
            path: "/chat",
            async lazy() {
              const { Chat } = await import("@/pages/chat");
              return { Component: Chat };
            },
            children: [
              {
                index: true,
                element: <EmptyChat />,
              },
              {
                path: ":conversationID",
                element: <QueryChat />,
              },
            ],
          },
          {
            path: "contact",
            async lazy() {
              const { Contact } = await import("@/pages/contact");
              return { Component: Contact };
            },
            children: contactRoutes,
          },
        ],
      },
      {
        path: "login",
        async lazy() {
          const { Login } = await import("@/pages/login");
          return { Component: Login };
        },
      },
    ],
  },
]);

export default router;
