from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        time.sleep(5) # Wait for the server to start
        page.goto("http://localhost:9002")
        page.screenshot(path="jules-scratch/verification/verification.png")
        browser.close()

run()
