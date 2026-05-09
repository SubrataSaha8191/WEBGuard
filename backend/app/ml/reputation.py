import requests
import os

VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")


def check_virustotal(url):

    endpoint = "https://www.virustotal.com/api/v3/urls"

    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY
    }

    try:
        # Submit URL
        response = requests.post(
            endpoint,
            headers=headers,
            data={"url": url}
        )

        data = response.json()

        analysis_id = data["data"]["id"]

        # Fetch analysis
        analysis_url = (
            f"https://www.virustotal.com/api/v3/analyses/{analysis_id}"
        )

        result = requests.get(
            analysis_url,
            headers=headers
        )

        result_data = result.json()

        stats = result_data[
            "data"
        ]["attributes"]["stats"]

        malicious = stats.get(
            "malicious",
            0
        )

        suspicious = stats.get(
            "suspicious",
            0
        )

        harmless = stats.get(
            "harmless",
            0
        )

        return {
            "malicious": malicious,
            "suspicious": suspicious,
            "harmless": harmless
        }

    except Exception as e:
        return {
            "error": str(e)
        }