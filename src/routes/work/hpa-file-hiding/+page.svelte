<script lang="ts">
	import ProjectPage from '#lib/components/ProjectPage.svelte';

	// Screenshots (static/images/hpa-file-hiding/) centered at their own size, but never wider than
	// the column (small ones aren't blown up), with a faint border so the dark terminal shots don't
	// blend into the dark theme. width/height reserve each image's space, so the page doesn't shift
	// as they load. They're the files' pixel sizes, except for images taller than 300px: there
	// they're scaled down to 300px tall (same proportions), which caps the height. (A CSS max-height
	// would need width: auto, which stops the space being reserved)
	const shot = 'h-auto max-w-full self-center border border-foreground/30';

	// Section headings with a 1px line under them, like the resume page's. The line's space above
	// (mt-4) matches the content column's gap below it (gap-4)
	const headingClass = 'text-2xl font-bold sm:text-3xl';
	const ruleClass = 'mt-4 border-foreground';

	// The command-line tools used, shown in a table before the first figure, each name linking to its
	// man page on man7.org
	const tools = [
		{
			name: 'fdisk',
			man: 'https://man7.org/linux/man-pages/man8/fdisk.8.html',
			purpose: 'used for listing available disks'
		},
		{
			name: 'hdparm',
			man: 'https://man7.org/linux/man-pages/man8/hdparm.8.html',
			purpose: 'used for viewing and modifying disk parameters'
		},
		{
			name: 'dd',
			man: 'https://man7.org/linux/man-pages/man1/dd.1.html',
			purpose: 'used for copying files'
		},
		{
			name: 'hexdump',
			man: 'https://man7.org/linux/man-pages/man1/hexdump.1.html',
			purpose: 'used for viewing the data of files'
		},
		{
			name: 'md5sum',
			man: 'https://man7.org/linux/man-pages/man1/md5sum.1.html',
			purpose: 'used to compute and view MD5 signatures'
		}
	];

	// Table cells: 1px lines, like the resume page's rules
	const cell = 'border border-foreground/50 px-3 py-2 text-left align-top';

	// MD5 hashes of the four drive images (from figure 35), shown in a table after it. hpa and
	// hasFile fill its HPA and File columns (blank where left out); highlight colors the whole row
	// crimson (the two images whose hashes match)
	const hashes: {
		file: string;
		hpa?: string;
		hasFile?: string;
		md5: string;
		highlight?: boolean;
	}[] = [
		{ file: 'initial-disk.iso', hpa: 'No', hasFile: 'No', md5: '26e628892c9cbb7bd4936d180f43b67d' },
		{
			file: 'blank-drive-with-hpa.iso',
			hpa: 'Yes',
			hasFile: 'No',
			md5: 'e5d689f5e3b7ee49eb38844db92351e9',
			highlight: true
		},
		{
			file: 'drive-with-txt-no-hpa.iso',
			hpa: 'No',
			hasFile: 'Yes',
			md5: 'ba46aa7a2ff52a5e9843c311643c7fb0'
		},
		{
			file: 'drive-with-txt-and-hpa.iso',
			hpa: 'Yes',
			hasFile: 'Yes',
			md5: 'e5d689f5e3b7ee49eb38844db92351e9',
			highlight: true
		}
	];
</script>

<!-- Title and date come from this page's entry in src/lib/works.ts. Write paragraphs (<p>) between
     the figures -->
<ProjectPage>
	<p>
		This is a project that involves placing a file within the sectors of a
		<!-- New tab, underlined like the tools' links. External URL, so there's no app route to
		     resolve() -->
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<a
			href="https://www.utica.edu/academic/institutes/ecii/publications/articles/EFE36584-D13F-2962-67BEB146864A2671.pdf"
			target="_blank"
			rel="noreferrer"
			class="underline decoration-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:decoration-foreground motion-reduce:transition-none"
			>Host Protected Area<span class="sr-only">&nbsp;(opens in a new tab)</span></a
		>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
		on a hard drive. For academic integrity (and frankly safety) reasons I will not provide all of the
		exact commands and steps I performed but this will be an outline of this project to show the significance
		of an HPA in regards to cybersecurity and digital forensics. The following should not be attempted
		on any drive that contains data you want to keep.
		<br /><br /> An SSD or HDD could be rendered unusable, and all data be unrecoverably lost with
		the following tools. <br />
		<strong class="text-crimson underline">Use extreme caution with these utilities.</strong>
	</p>

	<div class="mt-6">
		<h2 class={headingClass}>Command-line Utilities used</h2>
		<hr class={ruleClass} />
	</div>

	<table class="w-full border-collapse">
		<tbody>
			{#each tools as tool (tool.name)}
				<tr>
					<th scope="row" class={[cell, 'font-mono font-normal']}>
						<!-- New tab, underlined like the Project Euler page's links. External URL, so there's
						     no app route to resolve() -->
						<!-- eslint-disable svelte/no-navigation-without-resolve -->
						<a
							href={tool.man}
							target="_blank"
							rel="noreferrer"
							class="underline decoration-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:decoration-foreground motion-reduce:transition-none"
							>{tool.name}<span class="sr-only">&nbsp;(man page, opens in a new tab)</span></a
						>
						<!-- eslint-enable svelte/no-navigation-without-resolve -->
					</th>
					<td class={cell}>{tool.purpose}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="mt-6">
		<h2 class={headingClass}>Getting the drive information</h2>
		<hr class={ruleClass} />
	</div>

	<p>
		Using the drive I was working on for this project, I first looked at the drive's information and
		then created an image of the drive called 'initial-disk.iso' which would be used as a reference
		to the original, unmodified disk.
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-02.jpg"
			alt="GNOME Disks showing the 160 GB Seagate ST3160212SCE hard disk at /dev/sda: 160,041,885,696 bytes, one 160 GB volume with unknown contents"
			width="530"
			height="300"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-03.jpg"
			alt="The GNOME Disks dialog for copying a whole drive to a file, saving the 160 GB disk to initial-disk.iso in the HPA_Project folder"
			width="682"
			height="248"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<p>
		Next, I got the drive's information by using the fdisk command with -l to show all of the drives
		on my system. From there, I identified the hard drive and saw the number of sectors it had, as
		well as the sector size.
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-05-1.jpg"
			alt="The command sudo fdisk -l"
			width="224"
			height="42"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-05-2.jpg"
			alt="fdisk output: Disk /dev/sda, 149.05 GiB, 160041885696 bytes, 312581808 sectors of 512 bytes; disk model USB3.0 External"
			width="974"
			height="179"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<div class="mt-6">
		<h2 class={headingClass}>Setting an HPA</h2>
		<hr class={ruleClass} />
	</div>

	<p>
		Using the hdparm utility, you can use the option -N to view a drive's maximum number of sectors
		as well as if an HPA is active or not. If the letter p is provided with a sector number, you can
		permanently change the maximum number of sectors once you include the flag <span
			class="whitespace-nowrap">--yes-i-know-what-i-am-doing</span
		> (yes, the flag is actually called that). In order for the change to occur, the drive must be power
		cycled.
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-06.jpg"
			alt="sudo hdparm -N /dev/sda reports max sectors = 312581808/312581808, HPA is disabled"
			width="856"
			height="179"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<p>
		I decided to make the HPA 10GB in size as it would be one of the easier values to calculate the
		sector for. 1GB is equal to 2<sup>30</sup> bytes or 1,073,741,824 bytes, so 10GB is equal to
		10,737,418,240 bytes. Because the hard drive I was working on had a sector size of 512 bytes, I
		divided the 10,737,418,240 bytes by 512 to get 20,971,520 sectors (amounting to 10GB in size).
		<br /><br />
		I knew from the output of hdparm that the maximum number of visible sectors on the drive was 312,581,808.
		To set an HPA of 10GB, I subtracted 20,971,520 from the drive's 312,581,808 sectors to get 291,610,288.
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-07.jpg"
			alt="sudo hdparm -N p291610288 /dev/sda refuses: use of -Nnnnnn is VERY DANGEROUS, reducing the apparent size of the drive can destroy its contents, supply the --yes-i-know-what-i-am-doing flag if you really want this. Program aborted"
			width="1048"
			height="300"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-08.jpg"
			alt="sudo hdparm --yes-i-know-what-i-am-doing -N p291610288 /dev/sda sets max visible sectors to 291610288 (permanent): max sectors = 291610288/312581808, HPA is enabled"
			width="1165"
			height="171"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<p>After a power cycle, the drive no longer registered at 160GB, and now showed as 149GB.</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-10.jpg"
			alt="GNOME Disks now shows the drive as a 149 GB hard disk: 149,304,467,456 bytes, one 149 GB volume with unknown contents"
			width="667"
			height="300"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<div class="mt-6">
		<h2 class={headingClass}>Placing a file</h2>
		<hr class={ruleClass} />
	</div>

	<p>To place a file, I removed the HPA I previously set and power cycled the drive.</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-17.jpg"
			alt="hdparm setting max visible sectors to 312581808 (permanent): max sectors = 312581808/312581808, HPA is disabled"
			width="813"
			height="101"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-18.jpg"
			alt="The drive listed as a 160 GB hard disk, ST3160212SCE"
			width="261"
			height="73"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<p>
		Here is the beginning of the text file that I used containing the script to "The Lord of the
		Rings: The Fellowship of the Ring":
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-14.jpg"
			alt="The start of the Fellowship of the Ring script in a text editor: BLACK SCREEN, SUPER: New Line Cinema Presents, SUPER: A Wingnut Films Production, then Galadriel's voice-over"
			width="684"
			height="300"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<p>
		Using the dd utility, you can write to a specific sector of a drive. I'm leaving out my exact
		command purposefully, however, this was the output that showed me data had been written to the
		location I wanted:
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-20.jpg"
			alt="397+1 records, 203335 bytes"
			width="910"
			height="93"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<p>
		Then, using the hexdump utility for viewing file content, I included the flag "-C" to show the
		data in both hex and ASCII form, then specified the starting byte with the "-s" flag and
		included the "-n" flag to display a specific number of bytes of data.
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-21-1.jpg"
			alt="The command sudo hexdump -C /_ -s $(( _ * 512 )) -n _"
			width="867"
			height="32"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<p>
		If the correct values are used, you can view the contents of a file placed at a specific sector
		like so:
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-21-2.jpg"
			alt="Hexdump output starting at offset 22c33d6200, its text column reading &quot;BLACK SCREEN.. SUPER: New Line Cinema Presents.. SUPER: A Wingnut Films Production..BLACK CONTINUES... ELVISH SINGING....A WOMAN'S VOICE IS whispering, tinged with SADNESS and R&quot;"
			width="1016"
			height="300"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<p>I then created an image of the drive with no HPA set and the file placed on it:</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-22.jpg"
			alt="The GNOME Disks dialog for copying a whole drive to a file, saving the 160 GB disk to drive-with-txt-no-hpa.iso"
			width="685"
			height="255"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<div class="mt-6">
		<h2 class={headingClass}>Verifying the file is hidden</h2>
		<hr class={ruleClass} />
	</div>

	<p>With the file placed, I re-enabled the HPA and power cycled the drive again.</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-23.jpg"
			alt="hdparm setting max visible sectors to 291610288 (permanent): max sectors = 291610288/312581808, HPA is enabled"
			width="798"
			height="103"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-24.jpg"
			alt="The drive listed as a 149 GB hard disk, ST3160212SCE"
			width="251"
			height="74"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<p>
		Then, once I confirmed that it was showing up as a 149GB drive, I tried using the exact same
		hexdump command that I did previously to view the contents of the file. This time, however, I
		was met with the following "invalid argument" message. This is not because the data (or even the
		sectors) don't exist, but because they cannot be seen while the HPA is enabled.
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-26.jpg"
			alt="hexdump: /dev/sda: Invalid argument"
			width="535"
			height="35"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<p>
		With that confirmed, I created another image of the drive with an HPA enabled and the file
		placed:
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-27.jpg"
			alt="The GNOME Disks dialog for copying a whole drive to a file, saving the now 149 GB disk to drive-with-txt-and-hpa.iso"
			width="686"
			height="248"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<p>
		Once the image was created, I then removed the HPA, power cycled the drive, and used the same
		hexdump command as before to see the contents of the file. Before I was met with an "invalid
		argument" message however now I was able to see the contents again.
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-28.jpg"
			alt="hdparm setting max visible sectors to 312581808 (permanent): max sectors = 312581808/312581808, HPA is disabled"
			width="811"
			height="112"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-29.jpg"
			alt="Hexdump further into the hidden sectors, its text column reading &quot;GALADRIEL (V.O.) (CONT'D). Sauron, the enemy of the Free Peoples of Middle Earth, was defeated. SAURON'S ARMOR clatters to the&quot;"
			width="1132"
			height="300"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<div class="mt-6">
		<h2 class={headingClass}>Recovering the file</h2>
		<hr class={ruleClass} />
	</div>

	<p>
		Now that the file was confirmed to still exist, I created a copy of the file using the dd
		command. I specified that I wanted to read from a specific byte on the hard drive and copy the
		contents to my computer, then save the result as a .txt file. The output of the command showed
		that 203,335 bytes were written to the newly created file and when I opened the original file
		and the newly created one, I could see that they were identical.
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-30.jpg"
			alt="Writing the contents of the file to a new .txt file."
			width="899"
			height="98"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<p>The original file on the left, and the recovered file on the right:</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-32.png"
			alt="The original script and the copy recovered from the drive side by side in a text editor, identical line for line"
			width="1086"
			height="300"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<p>
		I then re-enabled the HPA and attempted once more to access the file. With the HPA enabled, I
		was met with the previous "invalid argument" message again.
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-33.jpg"
			alt="hdparm setting max visible sectors to 291610288 (permanent): max sectors = 291610288/312581808, HPA is enabled"
			width="807"
			height="106"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-34.jpg"
			alt="hexdump: /dev/sda: Invalid argument"
			width="541"
			height="32"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<div class="mt-6">
		<h2 class={headingClass}>Results</h2>
		<hr class={ruleClass} />
	</div>

	<p>
		Finally, I used the md5sum utility to calculate the hashes of each of the four images I captured
		of the drive.
	</p>

	<figure class="flex flex-col gap-2">
		<img
			src="/images/hpa-file-hiding/figure-35.jpg"
			alt="md5sum of the four disk images: initial-disk.iso 26e628892c9cbb7bd4936d180f43b67d, blank-drive-with-hpa.iso e5d689f5e3b7ee49eb38844db92351e9, drive-with-txt-no-hpa.iso ba46aa7a2ff52a5e9843c311643c7fb0, drive-with-txt-and-hpa.iso e5d689f5e3b7ee49eb38844db92351e9, the same as the blank drive with the HPA"
			width="1265"
			height="251"
			loading="lazy"
			decoding="async"
			class={shot}
		/>
	</figure>

	<!-- Mono throughout, a size smaller on phones. There the file names wrap at their hyphens and the
	     hashes anywhere -->
	<table class="w-full border-collapse font-mono text-sm sm:text-base">
		<!-- Headings in the body font, bold, so they read as headings over the mono cells -->
		<thead class="font-sans">
			<tr>
				<th scope="col" class={cell}>Image name</th>
				<th scope="col" class={cell}>HPA</th>
				<th scope="col" class={cell}>File</th>
				<th scope="col" class={cell}>Hash</th>
			</tr>
		</thead>
		<tbody>
			{#each hashes as image (image.file)}
				<tr class={{ 'text-crimson': image.highlight }}>
					<th scope="row" class={[cell, 'font-normal']}>{image.file}</th>
					<!-- Two narrow columns -->
					<td class={[cell, 'w-12']}>{image.hpa}</td>
					<td class={[cell, 'w-12']}>{image.hasFile}</td>
					<td class={[cell, 'break-all']}>{image.md5}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<p>
		This confirmed that the file was successfully hidden from the images, as the second and fourth
		images generated the same MD5 hash. Despite having identical hashes, the drive at the time of
		the fourth image <strong>was not empty and contained the hidden file</strong>, which would not
		have been discoverable via a forensic image.
		<br /><br />
		Next time you have an HDD or SSD that says there aren't any files, will you trust that it's actually
		empty?
	</p>
</ProjectPage>
