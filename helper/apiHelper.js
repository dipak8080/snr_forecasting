async function waitForApiResponse(page, apiPath, timeout = 1* 60 * 1000) {
  const response = await page.waitForResponse(
    res => res.url().includes(apiPath),
    { timeout }
  );

  const info = {
    url: response.url(),
    method: response.request().method(),
    status: response.status(),
    ok: response.ok(),
    body: null,
  };

  try {
    info.body = await response.json();
  } catch {
    try {
      info.body = await response.text();
    } catch {
      info.body = null;
    }
  }

  return info;
}

module.exports = { waitForApiResponse };
