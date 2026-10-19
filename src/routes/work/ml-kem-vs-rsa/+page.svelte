<script lang="ts">
	import ProjectPage from '#lib/components/ProjectPage.svelte';

	let { data } = $props();

	// Section headings with a 1px line under them, like the resume page's. The line's space above
	// (mt-4) matches the content column's gap below it (gap-4)
	const headingClass = 'text-2xl font-bold sm:text-3xl';
	const ruleClass = 'mt-4 border-foreground';

	// The two functions' printed timings, side by side under the code
	const results = [
		{
			label: 'ML-KEM/Kyber',
			lines: [
				'Key generation time - 1.8897ms',
				'Encapsulation time - 1.9382ms',
				'Decapsulation time - 2.5266ms',
				'Key and cipher generation time - 3.9µs',
				'Encryption time - 16µs',
				'Decryption time - 10.9µs',
				'Total time - 6.3937ms'
			]
		},
		{
			label: 'RSA',
			lines: [
				'Key generation time - 1.2694284s',
				'Encryption time - 2.2582ms',
				'Decryption time - 21.2579ms',
				'Total time - 1.2929529s'
			]
		}
	];
</script>

<!-- Title and date come from this page's entry in src/lib/works.ts. The write-up below is copied
     word for word from the CS695 milestone 2 paper (the PDF in the project root, not published) -->
<ProjectPage>
	<p class="text-xl">
		An Analysis of “Quantum-Safe integration of TLS in SDN networks” and a benchmarking of ML-KEM
		compared to RSA for key generation, encryption, and decryption time.
	</p>

	<div class="mt-6">
		<h2 class={headingClass}>Introduction</h2>
		<hr class={ruleClass} />
	</div>
	<p>
		“Quantum-Safe integration of TLS in SDN networks” by Buruaga, Méndez, Brito, and Martin
		introduces a ciphersuite for the TLS 1.3 protocol that uses a hybridization of quantum-resistant
		and classical cryptographic methods. The goal of this paper was to design and test the
		ciphersuite combining both styles of cryptography to produce a means of secure communication in
		an environment where adversaries possess classical and quantum machines.
		<br /><br />
		The main contribution of the paper is the introduction of a new ciphersuite to be employed by TLS
		1.3. Buruaga et al. propose the combination of the Diffie-Hellman Key Exchange, Quantum Key Distribution,
		ML-KEM (formerly Kyber – a key encapsulation mechanism “related to the computational difficulty of
		the Module Learning with Errors problem”
		<a
			href="#ref-2"
			class="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground focus-visible:decoration-foreground"
			>[2]</a
		>), AES-256 in GCM, and SHA384. As such, the proposed ciphersuite name is:
	</p>
	<!-- break-all so the long name can wrap on narrow phones -->
	<p class="font-mono break-all">DHKE_QKD_PQC_TLS_AES_256_GCM_SHA_384</p>
	<p>
		This proposed implementation of TLS within an SDN network uses the three shared secret
		generation methods (DHKE, QKD, and PQC) along with a Key Derivation Function (KDF) in order to
		generate the cipher between two groups in the SDN.
	</p>

	<div class="mt-6">
		<h2 class={headingClass}>The motivation that inspired the work</h2>
		<hr class={ruleClass} />
	</div>
	<p>
		This paper is a direct result from recent notable advancements in the field of quantum computing
		and the subsequent requirements for post-quantum or quantum-resistant cryptography
		standardization and implementation. Buruaga et al. argue that “it is imperative to start
		encrypting the information right now, to mitigate the risk that a future quantum computer could
		decrypt data while it remains sensitive.” Multiple organizations have publicly announced their
		quantum chips, joining the often-called “race to 1 million qubits,” including IBM's Condor chip,
		Google's Willow chip, and Microsoft's Majorana 1 chip.
	</p>
	<p>
		As organizations and governments race to develop quantum chips that have higher qubit counts and
		improved error correction, there is speculation to the specific point that our existing
		cryptographic methods will be no longer secure. Shor's algorithm, developed in 1994, led to the
		discovery that quantum systems are particularly capable of factoring numbers and solving the
		discrete logarithm problem, the “two main staples on which current public key cryptography is
		based” (Buruaga et al.).
	</p>
	<p>
		Originally, in 2012, it was estimated that a system with 1 billion qubits could break RSA-2048.
		However, as their paper suggests, Craig Gidney's and Martin Ekerå's “How to factor 2048 bit RSA
		integers in 8 hours using 20 million noisy qubits” published in 2021 argues “the upper end of
		the estimate of how many qubits will be needed to factor 2048 bit RSA integers has dropped
		nearly two orders of magnitude; from a billion to twenty million.” For reference, IBM's Condor
		contains 1,121 qubits, Google's Willow contains 105 qubits (with notable improvements in error
		correction), and Microsoft's Majorana 1 contains 8 topological qubits with the plans to scale
		the number of qubits very quickly.
	</p>
	<p>
		These advancements are causing a growing number of researchers and scientists to test
		post-quantum cryptographic methods in the assumption that the near future will require
		replacements to existing public key cryptographic methods.
	</p>

	<div class="mt-6">
		<h2 class={headingClass}>How do authors collect the data, any challenges?</h2>
		<hr class={ruleClass} />
	</div>
	<p>
		Buruaga et al. conducted a performance evaluation of the proposed quantum-safe SDN-enabled TLS
		using the ciphersuite previously described. There was a focus on the latency, efficiency, and
		impact on the security of the system. The data collected measured the time to complete
		individual steps performed throughout the TLS handshake, and compared the times to classical
		methods. To ensure randomness of their tests, Buruaga et al. collected “more than 1,500
		instances for each topology with approximately 150 instances recorded for each combination of
		key exchange” that occurred over a two-week period to capture diverse network states.
	</p>
	<p>
		A noticeable challenge lies with the QKD component of the system. QKD is introduced as a
		substitution for DHKE, where “the functionality of the discrete log is performed by a physical
		process based on the properties of quantum physics” (Buruaga et al.). While this method is
		immune to computational attacks, there must be a QKD link to allow this part of the handshake to
		work. In the performance evaluation, there was testing done on both a direct connection and with
		the use of an intermediate QKD node. Building an infrastructure to support this system could be
		time-consuming and costly, leading to a potential challenge of this exact implementation.
		Additionally, Buruaga et al. make an argument that the Key Provisioning System should be
		well-designed as “the underlying QKD network can introduce significant variability due to
		fluctuations in the quantum channel.”
	</p>

	<div class="mt-6">
		<h2 class={headingClass}>
			What metrics are used by authors to analyze the data and why such metrics?
		</h2>
		<hr class={ruleClass} />
	</div>
	<p>
		In the results, the time to complete various steps of the TLS handshake is captured, as well as
		important computational information such as the size of the key, level of NIST security, and
		security bits. By using these metrics, we are able to gauge a number of important factors when
		considering the implementation of TLS. The size of the key is important to consider as larger
		keys require more storage and processing power, where the level of NIST security and security
		bits show the strength corresponding to the different cryptographic methods that the ciphersuite
		is composed of. These metrics aid in providing the computational toll versus achieved security
		in the performance evaluation.
	</p>

	<div class="mt-6">
		<h2 class={headingClass}>An experiment</h2>
		<hr class={ruleClass} />
	</div>
	<p>
		I spent some time researching the methods used in this paper, and after some time searching I
		came across the
		<!-- External URL, so there's no app route to resolve() -->
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<a
			href="https://github.com/RustCrypto"
			target="_blank"
			rel="noreferrer"
			class="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground focus-visible:decoration-foreground"
			>RustCrypto GitHub repository<span class="sr-only">&nbsp;(opens in a new tab)</span></a
		>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
		where a collection of crates for various cryptographic functions are maintained. Among them are both
		ML-KEM and AES-GCM-256. I first wrote a function to encrypt and decrypt using the standard RSA method.
		While not the complete picture, I added another function that partially accomplishes the hybridization
		of classical and PQC methods the authors suggest for cryptographic security moving forward. Then,
		I passed a text file of random quotes to encrypt and decrypt as test data and compared the results
		in time required to process each step.
	</p>

	<!-- The code, highlighted at build time (trusted HTML from Shiki); the captions are for screen
	     readers, as the paper showed the code without them -->
	<figure>
		<figcaption class="sr-only">The RSA function</figcaption>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html data.rsa}
	</figure>
	<figure>
		<figcaption class="sr-only">The ML-KEM (Kyber) function</figcaption>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html data.kyber}
	</figure>

	<p>
		The script I wrote uses ML-KEM (formerly Kyber) to create a public and private key which are
		used to encapsulate a shared key between two users. Once the shared key is established, the
		messages are encrypted via AES-GCM-256 using the ML-KEM key generated, and then decrypted using
		the same key. Similar to the results of Buruaga et al., the hybrid approach, while appearing to
		have more steps and use more complicated methods, is far more efficient in key generation time
		(and therefore overall time) compared to an existing asymmetric key method like RSA.
	</p>

	<!-- Each function's printed timings, boxed like the code: side by side from sm: up, stacked
	     below -->
	<div class="grid gap-4 sm:grid-cols-2">
		{#each results as result (result.label)}
			<figure class="flex flex-col gap-2">
				<figcaption class="font-bold">{result.label}</figcaption>
				<pre
					class="overflow-x-auto border border-foreground/50 p-4 font-mono text-sm leading-relaxed">{result.lines.join(
						'\n'
					)}</pre>
			</figure>
		{/each}
	</div>

	<div class="mt-6">
		<h2 class={headingClass}>Significant findings, insights, and conclusions</h2>
		<hr class={ruleClass} />
	</div>
	<p>
		Initially the implementation of post-quantum cryptography into existing systems was seen as
		impractical due to its computational weight. The results from this paper propose implementations
		that do not take as heavy of a computational toll as once thought, as algorithms like ML-KEM and
		ML-DSA are improved upon and tested more comprehensively. In particular, the operation time of
		PQC (159.82 microseconds) and QKD (234.28 microseconds) compared to the existing operation time
		of Diffie-Hellman (460.38 microseconds) shows that the hybridization of the TLS protocol incurs
		a minimal penalty in performance.
	</p>
	<p>
		While a minimal penalty in performance is incurred, a substantial level of security is gained in
		the SDN networks described in this paper and has the capability to protect a network environment
		against classical and quantum attacks.
	</p>
	<p>
		In their closing remarks, Buruaga et al. stated “this finding underscores the viability of
		hybridization as a practical approach to transitioning current security infrastructures toward
		quantum-safe ones, protecting data transfers even in the long term.”
	</p>

	<div class="mt-6">
		<h2 class={headingClass}>References</h2>
		<hr class={ruleClass} />
	</div>
	<!-- scroll-mt clears the fixed nav when the in-text [2] link jumps here -->
	<ol class="flex flex-col gap-3">
		<li id="ref-1" class="scroll-mt-24">
			[1] Buruaga, Jaime S., et al. “Quantum-Safe integration of TLS in SDN networks.” arXiv
			preprint arXiv:2502.17202 (2025).
		</li>
		<li id="ref-2" class="scroll-mt-24">
			[2] --, “Module-Lattice-Based Key-Encapsulation Mechanism Standard,” U.S. Department of
			Commerce, Washington, D.C., Tech. Rep. Federal Information Processing Standards Publications
			(FIPS PUBS) [Online]. Available:
			<!-- eslint-disable svelte/no-navigation-without-resolve -->
			<a
				href="https://doi.org/10.6028/NIST.FIPS.203"
				target="_blank"
				rel="noreferrer"
				class="break-all underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground focus-visible:decoration-foreground"
				>https://doi.org/10.6028/NIST.FIPS.203<span class="sr-only">&nbsp;(opens in a new tab)</span
				></a
			>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		</li>
		<li id="ref-3" class="scroll-mt-24">
			[3] Gidney, Craig, and Martin Ekerå. “How to factor 2048 bit RSA integers in 8 hours using 20
			million noisy qubits.” Quantum 5 (2021): 433.
		</li>
	</ol>
</ProjectPage>
