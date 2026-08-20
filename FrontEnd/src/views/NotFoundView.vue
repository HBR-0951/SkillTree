<template>
  <div class="page">
    <span class="label">404</span>
    <h1>這條枝上沒有東西</h1>
    <p>你找的頁面不存在，或是筆記還沒寫。</p>
    <RouterLink class="btn-primary" to="/">← 回技能樹</RouterLink>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 120px 40px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-start;
  max-width: 620px;
  margin: 0 auto;
}
h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 600;
  letter-spacing: -0.025em;
}
p {
  margin: 0 0 10px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-muted);
}
</style>
