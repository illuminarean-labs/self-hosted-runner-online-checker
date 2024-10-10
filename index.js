const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const runnerLabelsStr = core.getInput('runner-labels', { required: true });
        const runnerLabels = runnerLabelsStr.split(/[, ;]+/).map(label => label.trim());
        const includeOrganizationRunners = core.getInput('include-organization-runners') === 'true';

        const token = core.getInput('GITHUB_TOKEN', { required: true })
        const octokit = github.getOctokit(token);

        const runners = [];

        const { data: response } = await octokit.rest.actions.listSelfHostedRunnersForRepo({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
        });
        core.info(`Repository Runner: ${JSON.stringify(response.runners, null, 2)}`);
        runners.push(...response.runners);

        if (includeOrganizationRunners) {
            const { data: response } = await octokit.rest.actions.listSelfHostedRunnersForOrg({
                org: github.context.repo.owner,
            });
            runners.push(...response.runners);
        }

        let targetRunners = [];
        if (runnerLabelsStr === '' || runnerLabelsStr === 'all') {
            targetRunners = runners;
        } else {
            targetRunners = runners.filter(runner => runnerLabels.every(label => runner.labels.includes(label)));
        }

        for (const runner of targetRunners) {
            if (runner.status === 'online') {
                core.info(`Found online runner with labels: ${runnerLabels}: ${runner.name} (ID: ${runner.id})`);
                core.setOutput("found", "success");
                return;
            }
        }

        core.info(`No online runner with labels: ${runnerLabels} found`);
        core.setOutput("found","failure");
    } catch (error) {
        core.setFailed(error.message);
    }
}

run().then();