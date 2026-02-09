async function waitForApiResponse(page, apiPath, timeout = 2*60*1000) {
  const response = await page.waitForResponse(
    res =>
      res.url().includes(apiPath) &&
      ['GET', 'POST'].includes(res.request().method()) &&
     [200, 201, 202, 204].includes(res.status()),
    { timeout }
  );

  try {
    return await response.json();
  } catch {
    return null; 
  }
}

module.exports = { waitForApiResponse };
