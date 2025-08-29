from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:8000/browser/")
    page.wait_for_selector('.calendar-container')
    page.screenshot(path="jules-scratch/verification/calendar.png")
    browser.close()
