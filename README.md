# Hello Self Hosted Runner Online Checker!👋

This is a simple GitHub Action that checks if the self-hosted runner is online or not.

## Inputs
- `runner-labels`: (Optional) The labels of the runner to check. If you have multiple runners, you can specify the labels of the runner you want to check. If you want to check all runners, you can use `all` or blank
- `include-organization-runners`: (Optional) If you want to check organization runners, you can set this to `true`. Default is `false`. (Experimental)
- `GITHUB_TOKEN`: (Required) The GitHub token to use for authentication.
  - `repo:full` (When you want to check only repository runners)
    ![img.png](img.png)
  - `admin:org.manager_runner`: Organization Manage Runner (When you want to check organization runners) (Experimental)
    ![img_1.png](img_1.png)
    - It is not tested yet. Please let me know if you have any problems.
     
## Example
```yaml
name: Check Runner Online

on: [push]

jobs:
  check-self-hosted-runner:
    runs-on: ubuntu-latest
    id: check-runner-online
    outputs:
      found: ${{ steps.check-runner-online.outputs.found }}
    steps:
      - name: Check Runner Online
        id: check-runner-online
        uses: YangTaeyoung/self-hosted-runner-online-checker@v1
        with:
          runner-labels: 'self-hosted x64 my-runner'
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  some_another_job:
    runs-on: ubuntu-latest
    needs: check-self-hosted-runner
    if: ${{ success() && needs.check-self-hosted-runner.outputs.found == 'success' }}
    steps:
      - name: Runner is online
        run: echo "Runner is online"
 
  some_the_other_job:
    runs-on: ubuntu-latest
    needs: check-self-hosted-runner
    if: ${{ success() && needs.check-self-hosted-runner.outputs.found == 'failure' }}
    steps:
      - name: Runner is offline
        run: echo "Runner is offline"
```