<script lang="ts">
	import BackArrow from '#lib/components/BackArrow.svelte';

	// Content from the resume PDF: work experience, education and skills only
	const jobs = [
		{
			title: 'Operations Analyst II',
			org: 'Boston University IS&T',
			place: 'Boston, MA',
			dates: 'July 2023 - Present',
			points: [
				'Develop and maintain processes for data sanitization ensuring confidential data is unrecoverable from retired university assets in compliance with NIST SP 800-88',
				'Triage and escalate tickets from faculty, staff, and students to proper support groups for ongoing major incidents, phishing attempts, hardware/software support, and account assistance',
				'Serve on the student management team to hire, train, and manage over 50 student employees',
				'Create Power BI dashboards, ServiceNow reports, and Python scripts to report Service Desk and Learning & Event Technology Services metrics to leadership',
				'Publish and maintain internal and client-facing webpages',
				'Point person for the student loaner laptop program containing nearly 100 MacBook Airs for assisting students in their academic work'
			]
		},
		{
			title: 'Lead Code Coach',
			org: 'The Coder School',
			place: 'Las Vegas, NV',
			dates: 'July 2020 - August 2023',
			points: [
				'Conducted opening of second Coder School location in Nevada',
				'Developed curricula including web development, game development, esports programming, algorithm design, and music production with code',
				'Taught computer science principles and programming to students aged 5 through 17 in educational and summer camp settings',
				'Designed projects and applications with students using Python, HTML, CSS, JavaScript, Unity, and Scratch',
				'Led groups of up to 12 students in classes on differing languages and subjects'
			]
		},
		{
			title: 'Program Coordinator',
			org: 'Brookline Teen Center',
			place: 'Brookline, MA',
			dates: 'January 2022 - May 2023',
			points: [
				"Rebuilt organization's website for improved experience and performance",
				'Led a team of specialists serving the Brookline Public Schools district',
				"Facilitated administrative duties of account management, IT support, data analytics, and oversight for the center's middle school program"
			]
		}
	];

	const degrees = [
		{
			degree: 'Master of Science in Computer Science',
			detail: 'Concentration in Security',
			date: 'May 2026'
		},
		{
			degree: 'Bachelor of Arts in Music',
			detail: 'Minors in Computer Science and Arts Leadership',
			date: 'May 2022'
		}
	];

	const skills = [
		{
			group: 'Tools & platforms',
			items: [
				'ServiceNow',
				'Iru',
				'Power BI',
				'Duo Admin',
				'Claude Code',
				'SailPoint',
				'KACE',
				'CrowdStrike',
				'Google Admin',
				'SharePoint',
				'WordPress Admin',
				'Docker'
			]
		},
		{ group: 'Forensics', items: ['FTK Imager', 'Autopsy', 'OSForensics'] },
		{ group: 'Languages', items: ['Rust', 'Python', 'Java', 'JavaScript', 'HTML', 'CSS'] },
		{ group: 'Source control', items: ['Git'] },
		{ group: 'Certifications', items: ['ITIL'] }
	];

	// Each section: bold heading, then a 1px rule with the same space (my-3) above and below it
	const headingClass = 'text-3xl font-bold sm:text-4xl';
	const ruleClass = 'my-3 border-foreground';
</script>

<svelte:head>
	<title>Resumé · Ryan Christopher</title>
</svelte:head>

<!-- Top padding clears the fixed nav bar, 2.5% side inset. Sections in one centered column.
     Below lg: the column reaches the back arrow's corner, so the content starts under it there
     (pt-36: the arrow's top-20 + its 42px + a ~22px gap) -->
<section id="top" class="min-h-svh px-[2.5%] pt-36 pb-14 lg:pt-24">
	<!-- No visible heading by choice; kept for screen readers and the page outline -->
	<h1 class="sr-only">Resume</h1>

	<!-- Fixed top-left back arrow -->
	<BackArrow />

	<!-- Not pushed down for the arrow: it's fixed, so the column starts level with it -->
	<div class="mx-auto flex max-w-3xl flex-col gap-12">
		<section>
			<h2 class={headingClass}>Work Experience</h2>
			<hr class={ruleClass} />
			<ol class="flex flex-col gap-8">
				{#each jobs as job (job.title)}
					<li>
						<h3 class="text-xl font-bold">{job.title}</h3>
						<!-- One line from sm: up; on phones the dates go on their own line. The dot before them
						     is spaced with 1ch padding, as Svelte trims spaces inside the span -->
						<p class="mt-2 font-mono text-sm text-foreground/90">
							{job.org} · {job.place}<span class="hidden px-[1ch] sm:inline">·</span><span
								class="block sm:inline">{job.dates}</span
							>
						</p>
						<ul class="mt-2 flex list-disc flex-col gap-1.5 pl-5 marker:text-foreground/50">
							{#each job.points as point (point)}
								<li>{point}</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ol>
		</section>

		<section>
			<h2 class={headingClass}>Education</h2>
			<hr class={ruleClass} />
			<h3 class="text-xl font-bold">Boston University</h3>
			<ul class="mt-2 flex flex-col gap-3">
				{#each degrees as degree (degree.degree)}
					<li>
						<!-- Like the job lines: one line from sm: up; on phones the detail goes on its own line,
						     without the comma. The space between the spans is kept (it collapses on phones) -->
						<p>
							<span class="font-bold">{degree.degree}</span><span class="hidden sm:inline">,</span>
							<span class="block sm:inline">{degree.detail}</span>
						</p>
						<p class="font-mono text-sm text-foreground/90">{degree.date}</p>
					</li>
				{/each}
			</ul>
		</section>

		<section>
			<h2 class={headingClass}>Skills</h2>
			<hr class={ruleClass} />
			<dl class="flex flex-col gap-5">
				{#each skills as skill (skill.group)}
					<div>
						<dt class="font-bold">{skill.group}</dt>
						<!-- Outlined mono chips, like the tags on the work cards -->
						<dd class="mt-2 flex flex-wrap gap-2">
							{#each skill.items as item (item)}
								<span
									class="border border-foreground/50 px-2 py-0.5 font-mono text-sm text-foreground/90"
									>{item}</span
								>
							{/each}
						</dd>
					</div>
				{/each}
			</dl>
		</section>
	</div>
</section>
