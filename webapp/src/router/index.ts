import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NewProposalPage from "@/views/NewProposalPage.vue";
import ProposalDetailPage from "@/views/ProposalDetailPage.vue";
import AboutView from "../views/AboutView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/proposal/:id",
      name: "proposal",
      component: ProposalDetailPage,
    },
    {
      path: "/new",
      name: "newproposal",
      component: NewProposalPage,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
  ],
});

export default router;
