# NexCredit AI terminal proof sequence

Run each block separately while recording. Keep the terminal large enough for the output to be readable.

## 1. Establish the repository and current source

```bash
cd /Users/hrishikeshreddygavinolla/Desktop/NexCredit-AI
git status --short
git log -1 --oneline
git remote get-url origin
```

Expected: `git status --short` prints nothing, the latest commit is shown, and the origin is the NexCredit GitHub repository.

## 2. Prove the backend is live

```bash
curl -s http://localhost:8081/api/health | python3 -m json.tool
```

Expected: the JSON contains `"status": "UP"` and `"service": "nexcredit-underwriting-api"`.

## 3. Prove the frontend is live

```bash
curl -I http://localhost:3001
```

Expected: `HTTP/1.1 200 OK`.

## 4. Run the backend verification suite

```bash
./mvnw -P\!bundle-backend-and-frontend test
```

At the end, show:

```text
Tests run: 14, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

## 5. Run the frontend tests

```bash
cd /Users/hrishikeshreddygavinolla/Desktop/NexCredit-AI/src/frontend
CI=true npm test -- --runInBand
```

At the end, show `Tests: 2 passed, 2 total`. React `act(...)` warnings are test-only warnings and do not represent a failed build.

## 6. Produce the deployable frontend build

```bash
npm run build
```

Expected: `The build folder is ready to be deployed.` CSS compatibility warnings are non-blocking.

## 7. Show the engineering structure

```bash
cd /Users/hrishikeshreddygavinolla/Desktop/NexCredit-AI
find src/main/java/com/synchrony/nexcredit -maxdepth 2 -type f | sort
```

Point out the `credit`, `security`, and `ai` packages, then open `ARCHITECTURE.md` in the editor.

## 8. Validate the secure submission builder

```bash
bash test/build-submission-test.sh
```

Expected: `build-submission.sh tests passed`. This test proves that missing or fake videos are rejected and that secrets, build caches, old scaffold code, and nested submission files are excluded.

## 9. Final packaging after the real recording exists

Confirm this file exists first:

```text
/Users/hrishikeshreddygavinolla/Desktop/NexCredit-AI/submission/SE23UCSE065/SE23UCSE065.mp4
```

Then run:

```bash
cd /Users/hrishikeshreddygavinolla/Desktop/NexCredit-AI
bash build-submission.sh
unzip -t submission/SE23UCSE065.zip
unzip -l submission/SE23UCSE065.zip | head -40
```

Expected final attachments:

```text
submission/SE23UCSE065.pdf
submission/SE23UCSE065.zip
```
