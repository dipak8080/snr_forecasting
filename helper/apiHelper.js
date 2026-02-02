async function waitForApiResponse(page, apiPath, timeout = 30000) {
  const response = await page.waitForResponse(
    res => res.url().includes(apiPath) && res.status() === 200,
    { timeout }
  );

  try {
    return await response.json();
  } catch {
    return null;
  }
}

module.exports = { waitForApiResponse };
