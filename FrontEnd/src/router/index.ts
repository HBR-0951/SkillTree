import { createRouter, createWebHistory } from 'vue-router'
import TreeView from '@/views/TreeView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'tree',
      component: TreeView,
      // ?skill=kubernetes 直接開該節點的面板
      props: (route) => ({ initialSkillId: (route.query.skill as string) ?? null }),
    },
    {
      path: '/notes/:slug',
      name: 'note',
      component: () => import('@/views/NoteView.vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
