from app.routes.scan import scan_url
from app.models.schemas import URLRequest

req = URLRequest(url="https://admission.rcciit.org.in/")
res = scan_url(req)
print(res)
