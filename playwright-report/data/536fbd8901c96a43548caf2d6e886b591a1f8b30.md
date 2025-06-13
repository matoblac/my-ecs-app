# Test info

- Name: home page loads
- Location: /root/Projects-YacthClub/my-ecs-app/tests/e2e/home.spec.ts:3:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

    at /root/Projects-YacthClub/my-ecs-app/tests/e2e/home.spec.ts:4:14
```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 |
  3 | test('home page loads', async ({ page }) => {
> 4 |   await page.goto('/');
    |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  5 |   await expect(page.locator('body')).toContainText('Allen.ai');
  6 | });
  7 |
```