const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const runnerLabelsStr = core.getInput('runner-labels', { required: true });
        const runnerLabels = runnerLabelsStr.split(/[, ;]+/).map(label => label.trim());
        const includeOrganizationRunners = core.getInput('include-organization-runners') === 'true';

        const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

        const runners = [];

        // 1. List self-hosted runners
        const { data: repositoryRunners } = await octokit.rest.actions.listSelfHostedRunnersForRepo({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
        });
        runners.push(...repositoryRunners);

        if (includeOrganizationRunners) {
            const { data: organizationRunners } = await octokit.rest.actions.listSelfHostedRunnersForOrg({
                org: github.context.repo.owner,
            });
            runners.push(...organizationRunners);
        }

        const targetRunners = runners.filter(runner => runnerLabels.every(label => runner.labels.includes(label)));

        // 2. Runner Tag로 필터링
        let success = false;

        for (const runner of targetRunners) {
            if (runner.status === 'online') {
                core.info(`Found online runner with labels: ${runnerLabels}: ${runner.name} (ID: ${runner.id})`);
                success = true;
                break;
            }
        }

        if (!success) {
            core.setFailed(`No online runner found with labels: ${runnerLabels}`);
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

run().then();