# Hello Self Hosted Runner Online Checker!👋

This is a simple GitHub Action that checks if the self-hosted runner is online or not.

## Inputs
- `runner-labels`: (Optional) The labels of the runner to check. If you have multiple runners, you can specify the labels of the runner you want to check. If you want to check all runners, you can use `all` or blank

## Usage
```yaml
name: Check Runner Online

on: [push]

jobs:
  check-runner-online:
    runs-on: ubuntu-latest
    id: check-runner-online
    steps:
      - name: Check Runner Online
        uses: YangTaeyoung/self-hosted-runner-online-checker@v1
        with:
          runner-labels: 'self-hosted x64 my-runner'

  next-job:
    needs: check-runner-online
    runs-on: ${{ needs.check-runner-online.
```