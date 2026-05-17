// Seed the three Session-2 Field Notes drafts into Payload.
//
// Run with:
//   pnpm tsx --env-file=.env.local scripts/migration/seed-field-notes.ts
//
// What it does:
//   1. Connects to Payload via the local API.
//   2. For each of the three drafts, looks up by slug. If a row already exists,
//      it leaves it alone (idempotent — never overwrites editor changes).
//   3. If missing, creates the row with status='draft', EN + BM content,
//      noteNumber, readTimeMin, application, and an editorialNotes flag.
//
// Important: №03 carries an explicit editorialNotes warning that Alan must
// actively approve before status flips to 'published'. The script always
// creates with status='draft' — promotion to published is a manual editor
// action in /admin.
//
// File extension note: brief specified .mjs, but the project's @payload-config
// alias only resolves through TS path-mapping. Matching the existing
// import-posts.ts pattern keeps the script working.

import { getPayload } from 'payload'
import config from '@payload-config'

const log = (...a: any[]) => console.log('[seed-field-notes]', ...a)

// ─────────────────────────────────────────────────────────────────────────────
// Content
// ─────────────────────────────────────────────────────────────────────────────
// HTML bodies derived from content-drafts/session-2-field-notes.md.
// Em dashes in user-facing prose replaced with "and", colons, commas, or
// parentheses per BRAND-VOICE.md. Em dashes inside developer comments are
// fine (this file is a developer comment + a data payload).

const NOTE_01_EN = `
<p>The contractor called late in the afternoon. We knew the voice already. He had been on the line earlier in the week, and the week before that. Different blade each time. Same problem.</p>
<p>The job was a piling project in the Klang Valley. Reinforced concrete piles, high strength, dense rebar. The cutting itself was straightforward in theory: a series of cuts that needed to be clean, dimensionally consistent, and finished before a sequence of downstream installations could begin. In practice the piles were defeating the blades.</p>
<p>By the time he called us he had already tried three brands. Two imports, one local. The first set of segments went on the first day. The second set lasted longer but the cutting speed was inconsistent. Fast for a few cuts, then sluggish for the next, then segments fracturing. The third set fared no better.</p>
<p>What he said on the phone, almost as an aside before hanging up: "If you also tell me it's the operator, I'm done."</p>
<h2>What we did before quoting</h2>
<p>The first thing we did was the thing many suppliers in this trade do not do. We did not quote a blade. We went to the site.</p>
<p>This is one of those small operational habits that does not look like much from the outside but changes everything in practice. A blade quote made over the phone is a guess wearing a price tag. A blade specified after standing in front of the actual concrete, the actual machine, the actual operator, and the actual aggregate is a different category of recommendation altogether.</p>
<p>By the time we arrived on site the next morning, the contractor had stopped expecting much. He was polite, but his attention was elsewhere. There was already a meeting being scheduled with the main contractor about the delay.</p>
<h2>What the worksite told us</h2>
<p>The first ten minutes told us most of what we needed to know. The blade was not the only problem. The blade was not even the main problem.</p>
<p>What we found, in the order we found it:</p>
<ul>
<li>The machine was older than the job called for. The RPM was unstable under load, drifting downward during the cut. Not catastrophic, but enough to keep the blade out of its optimal speed window for most of each cut.</li>
<li>The water supply at the cutting point was inconsistent. Pressure dropped when other site equipment drew from the same line. We could see the slurry running thicker than it should have, which meant insufficient cooling and accelerated segment wear.</li>
<li>The operator was feeding the blade too aggressively. Not because he did not know better, but because he had been told to make up time. Every cut was being pushed past the rate the blade could clear, which built up heat, which glazed the segments, which made the next cut even slower.</li>
<li>The previous blade specifications had all been chosen on bond hardness for general reinforced concrete. None had accounted for the specific aggregate in this batch of piles: granite-heavy, with a higher silica content than the European mix designs the imported blades were bonded for.</li>
</ul>
<p>None of these problems on its own would have failed the job. Stacked together, they made it impossible. The contractor's instinct (that the blade was wrong) was correct, but partial. The blade was wrong. So was the feed pressure. So was the water management. So was the assumption that aggregate composition did not vary enough to change a specification.</p>
<h2>What changed</h2>
<p>We did not replace the blade first. We changed the cutting method first. Specifically, we worked with the operator to slow the feed pressure to a rate the blade could clear, and we segmented the long cuts into shorter passes with cooling intervals. We adjusted the water flow rate and pressure at the cutting point. A small modification, no new equipment. We watched the machine through several cuts and noted where the RPM drift was worst, then advised the contractor on a maintenance check that would have to happen between shifts anyway.</p>
<p>Only after those changes did we change the blade, switching to a Coolman specification with a different bond hardness and segment geometry, matched to the actual aggregate profile in those piles.</p>
<p>By that afternoon the cutting speed had stabilised. Not flying, but steady, predictable, consistent. Segment wear was visible but normal. The operator stopped looking nervous between cuts.</p>
<p>The contractor finished the schedule. The meeting with the main contractor was cancelled.</p>
<blockquote>Many times, contractors think it's a product problem. In fact, it's a system problem.</blockquote>
<h2>The lesson</h2>
<p>That job changed how we operate. Before that project, Coolman was, like most diamond tools companies in Malaysia, primarily a product company. We sold blades. The blade was the unit of the business. Site testing happened, but mostly to validate what we already sold.</p>
<p>After that project, we started treating site testing, application knowledge, and machine-blade matching as the actual product. The blade is what changes hands. But the value is everything around the blade: the diagnosis, the matching, the cutting method advice, the willingness to walk away from a sale until the system is right.</p>
<p>It is not the framing most of the industry uses. Most diamond tools companies are still product companies. They sell SKUs. They quote on price. They do not go to the site unless the customer is large enough.</p>
<p>The contractors who get burned by that approach are the ones we hear from at 4 p.m. on a Friday, with a phone call that starts the same way. By the time they are calling, they are usually past expecting much. Which is precisely why turning up the next morning, looking past the blade to the system around it, matters.</p>
<p>A blade can fail for one reason. A project usually fails for several.</p>
`.trim()

const NOTE_01_BM = `
<p>Kontraktor itu menelefon lewat petang. Kami sudah kenal suaranya. Dia pernah menelefon minggu lepas, dan minggu sebelumnya. Mata pisau yang berbeza setiap kali. Masalah yang sama.</p>
<p>Kerja itu adalah projek pemasangan cerucuk di Lembah Klang. Cerucuk konkrit bertetulang, kekuatan tinggi, besi tetulang yang tebal. Pemotongan itu sendiri mudah dari segi teori: satu siri potongan yang perlu bersih, konsisten dari segi dimensi, dan selesai sebelum siri pemasangan seterusnya boleh bermula. Dalam praktiknya, cerucuk itu mengalahkan mata pisau.</p>
<p>Sebelum dia menelefon kami, dia sudah mencuba tiga jenama. Dua import, satu tempatan. Set segmen pertama habis pada hari pertama. Set kedua tahan lebih lama tetapi kelajuan pemotongan tidak konsisten. Laju untuk beberapa potongan, kemudian perlahan, kemudian segmen mula pecah. Set ketiga tidak lebih baik.</p>
<p>Apa yang dia kata di telefon, hampir sebagai kata-kata terakhir sebelum meletak: "Kalau awak juga kata ini masalah operator, habislah saya."</p>
<h2>Apa yang kami buat sebelum memberi sebut harga</h2>
<p>Perkara pertama yang kami buat adalah perkara yang ramai pembekal dalam bidang ini tidak buat. Kami tidak memberi sebut harga untuk mata pisau. Kami pergi ke tapak.</p>
<p>Ini adalah salah satu tabiat operasi kecil yang tidak kelihatan banyak dari luar tetapi mengubah segala-galanya dalam praktiknya. Sebut harga mata pisau melalui telefon adalah tekaan dengan harga. Mata pisau yang dispesifikasi selepas berdiri di hadapan konkrit sebenar, mesin sebenar, operator sebenar, dan agregat sebenar, adalah kategori cadangan yang berbeza sama sekali.</p>
<p>Apabila kami sampai di tapak keesokan paginya, kontraktor itu sudah tidak banyak berharap. Dia sopan, tetapi perhatiannya di tempat lain. Mesyuarat dengan kontraktor utama mengenai kelewatan sudah dijadualkan.</p>
<h2>Apa yang tapak kerja beritahu kami</h2>
<p>Sepuluh minit pertama memberitahu kami hampir semua yang perlu kami tahu. Mata pisau bukan satu-satunya masalah. Mata pisau bukan juga masalah utama.</p>
<p>Apa yang kami temui, mengikut urutan kami temui:</p>
<ul>
<li>Mesin itu lebih tua daripada yang sepatutnya digunakan. RPM tidak stabil di bawah beban, semakin perlahan semasa pemotongan. Bukan bencana, tetapi cukup untuk mengeluarkan mata pisau daripada zon kelajuan optimumnya untuk sebahagian besar setiap potongan.</li>
<li>Bekalan air di titik pemotongan tidak konsisten. Tekanan jatuh apabila peralatan tapak lain menggunakan paip yang sama. Kami boleh nampak buburan air mengalir lebih pekat daripada sepatutnya, yang bermakna penyejukan tidak mencukupi dan haus segmen yang dipercepatkan.</li>
<li>Operator memberi makan mata pisau terlalu agresif. Bukan kerana dia tidak tahu, tetapi kerana dia disuruh menampung masa. Setiap potongan ditolak melebihi kadar yang mata pisau boleh hadapi, yang menghasilkan haba, yang menggilap segmen, yang menjadikan potongan seterusnya lebih perlahan.</li>
<li>Spesifikasi mata pisau sebelumnya semuanya dipilih berdasarkan kekerasan ikatan untuk konkrit bertetulang umum. Tiada yang mengambil kira agregat tertentu dalam kumpulan cerucuk ini: kaya dengan granit, dengan kandungan silika yang lebih tinggi daripada reka bentuk campuran Eropah yang digunakan untuk mata pisau import tersebut.</li>
</ul>
<p>Tiada satu pun daripada masalah ini akan gagal kerja itu sendirian. Bertumpuk bersama, ia menjadikannya mustahil.</p>
<h2>Apa yang berubah</h2>
<p>Kami tidak menukar mata pisau dahulu. Kami menukar kaedah pemotongan dahulu. Khususnya, kami bekerja dengan operator untuk memperlahankan tekanan suapan kepada kadar yang mata pisau boleh hadapi, dan kami membahagikan potongan panjang kepada laluan pendek dengan selang penyejukan. Kami melaraskan kadar dan tekanan aliran air di titik pemotongan. Pengubahsuaian kecil, tiada peralatan baharu.</p>
<p>Hanya selepas perubahan itu kami menukar mata pisau, beralih kepada spesifikasi Coolman dengan kekerasan ikatan dan geometri segmen yang berbeza, dipadankan dengan profil agregat sebenar dalam cerucuk tersebut.</p>
<p>Petang itu, kelajuan pemotongan stabil. Bukan terbang, tetapi mantap, boleh diramal, konsisten. Haus segmen kelihatan tetapi normal. Operator berhenti kelihatan gementar antara potongan.</p>
<p>Kontraktor itu menyiapkan jadual. Mesyuarat dengan kontraktor utama dibatalkan.</p>
<blockquote>Banyak kali, kontraktor menyangka ini masalah produk. Sebenarnya, ini masalah sistem.</blockquote>
<h2>Pengajarannya</h2>
<p>Kerja itu mengubah cara kami beroperasi. Sebelum projek itu, Coolman, seperti kebanyakan syarikat alat berlian di Malaysia, adalah syarikat produk. Kami menjual mata pisau. Mata pisau adalah unit perniagaan kami. Ujian tapak berlaku, tetapi sebahagian besarnya untuk mengesahkan apa yang kami sudah jual.</p>
<p>Selepas projek itu, kami mula menganggap ujian tapak, pengetahuan aplikasi, dan padanan mesin dengan mata pisau sebagai produk sebenar. Mata pisau adalah apa yang bertukar tangan. Tetapi nilainya adalah segala-galanya di sekeliling mata pisau: diagnosis, padanan, nasihat kaedah pemotongan, kesediaan untuk berundur daripada jualan sehingga sistem itu betul.</p>
<p>Mata pisau boleh gagal kerana satu sebab. Projek biasanya gagal kerana beberapa sebab.</p>
`.trim()

const NOTE_02_EN = `
<p>It was late. Not late as in 9 p.m. Late as in past midnight, the kind of hour when a phone call from a number you do not recognise means something specific is wrong.</p>
<p>The contractor was on a road-opening job. Utility cable installation that required cutting the existing road surface, removing the cut sections, laying the cable in the trench beneath, and closing the road again before traffic returned in the morning.</p>
<p>It is a job with a hard deadline. The traffic control plan had been approved for a specific window. Past that window, the road had to reopen whether the cable was in or not. Past that window, with the work unfinished, the main contractor would issue a penalty. Past several such penalties, the subcontractor would be blacklisted from future utility projects with that maincon. There would be no second chances.</p>
<p>His blades were exploding segments. He had already lost time trying a second specification. The cutting was not progressing.</p>
<p>What he said, almost flatly: "If I don't finish tonight, I'm done."</p>
<p>We opened the store at 1 a.m.</p>
<h2>What we found when we arrived</h2>
<p>The road surface was a typical Malaysian road-opening job: a top layer of asphalt over a base of older reinforced concrete with mixed aggregate and inconsistent rebar. The two layers cut very differently. A blade optimised for one was working against the other.</p>
<p>The contractor had started with a general-purpose asphalt blade because that is what the surface layer was. The problem was that the moment the blade reached the reinforced concrete underneath, the bond was wrong, the segments could not handle the abrasion against the rebar, and the heat from the harder material was destroying the segment welds.</p>
<p>The second blade he had tried was rated for asphalt over concrete, but the specification assumed a relatively clean transition between the two materials. This particular stretch of road was older. The concrete underneath was not uniform. There were patches where the rebar was much denser than the spec sheet anticipated. The blade was hitting those zones and shedding segments.</p>
<p>By the time we arrived the site was almost silent. The traffic control crew was still in position. The workers were standing by the trench, waiting. The operator had stopped cutting because he could not justify destroying another blade.</p>
<h2>What changed</h2>
<p>The fix was a specification change. Laser-welded segments, which hold under thermal shock far better than brazed alternatives, and a blade with undercut protection at the segment-core junction, which prevents the kind of catastrophic segment loss that had been destroying the previous blades when they hit dense rebar zones.</p>
<p>We brought two blades. The first went on, started cutting, and we watched. For the first few minutes nobody talked. The cutting speed was steady. The slurry was clearing. The segments were not fracturing.</p>
<p>By the time the first cut was complete, the operator was visibly different. The whole site was visibly different. Time was still tight, but no longer impossible.</p>
<p>By the time the cable was in and the road was being closed, dawn was beginning at the edge of the sky.</p>
<h2>What the contractor said</h2>
<p>When the schedule was secured and the traffic control crew was packing up, the contractor came over to us. He was tired in the specific way that comes after a near-miss. Quiet. Not effusive.</p>
<p>What he said was not long. It was something close to: "If you hadn't come tonight, I really would have been finished."</p>
<p>I have thought about that line many times since.</p>
<p>Because the thing he was thanking us for was not the blade. The blade was three hundred and fifty ringgit. The blade was, in the grand sweep of his career, replaceable.</p>
<p>What he was thanking us for was the fact that somebody had picked up the phone after midnight. Somebody had opened the store at 1 a.m. Somebody had driven to a road-opening site with the right specification and stayed until the cutting was stable.</p>
<blockquote>Contractors don't always need a supplier. Sometimes they need someone willing to stand with them when the job goes hard.</blockquote>
<h2>The lesson</h2>
<p>The cutting industry, in its conventional shape, is a daytime business. Phones go to voicemail after 6 p.m. Stores close at 6:30. Sales reps work Monday to Friday. Technical staff are available "during business hours."</p>
<p>This is fine for most cuts. Most cuts happen during normal hours, with predictable materials, in adequate conditions. But the cuts that decide a contractor's career, the night road-openings, the emergency utility installations, the projects with maincons who do not accept delay, do not happen during business hours.</p>
<p>The cuts that decide a career happen at the inconvenient times. And the supplier who is reachable at those inconvenient times is, over many years, the supplier the contractor comes to trust with everything else.</p>
<p>This is not a marketing position. It is an operational decision. To be the kind of supplier who picks up the phone at midnight, you have to actually pick up the phone at midnight. There is no shortcut. There is no automated system that replaces it.</p>
<p>It costs more. It pays back over decades.</p>
<p>The contractor on that road-opening job has been a Coolman customer ever since. He has recommended us, in turn, to other contractors in his network. Some of those contractors have become our customers. Some of those, in their turn, have brought others.</p>
<p>The chain of trust that began with a midnight phone call and an opened store, fifteen-odd years ago, is now an indistinguishable thread inside the Coolman customer base. We cannot tell any more where the original referrals end and the new ones begin.</p>
<p>That is what stability in this business actually looks like. Not the absence of problems. The presence of someone reliably on the other end of the line when the problems arrive.</p>
`.trim()

const NOTE_02_BM = `
<p>Sudah lewat. Bukan lewat seperti pukul 9 malam. Lewat seperti selepas tengah malam, jenis waktu apabila panggilan telefon daripada nombor yang tidak dikenali bermakna sesuatu yang spesifik sedang tidak kena.</p>
<p>Kontraktor itu berada di tapak kerja membuka jalan. Pemasangan kabel utiliti yang memerlukan pemotongan permukaan jalan sedia ada, menyingkirkan bahagian yang dipotong, meletakkan kabel di dalam parit di bawah, dan menutup semula jalan sebelum lalu lintas kembali pada waktu pagi.</p>
<p>Ia adalah kerja dengan tarikh akhir yang ketat. Pelan kawalan lalu lintas telah diluluskan untuk tempoh tertentu. Selepas tempoh itu, jalan mesti dibuka semula, sama ada kabel sudah masuk atau tidak. Selepas tempoh itu, dengan kerja belum selesai, kontraktor utama akan mengenakan penalti. Selepas beberapa penalti seperti itu, subkontraktor akan disenarai hitam daripada projek utiliti masa depan dengan kontraktor utama tersebut. Tiada peluang kedua.</p>
<p>Mata pisaunya meletupkan segmen. Dia sudah hilang masa mencuba spesifikasi kedua. Pemotongan tidak maju.</p>
<p>Apa yang dia kata, hampir datar: "Kalau saya tak siap malam ni, habislah saya."</p>
<p>Kami buka kedai pada pukul 1 pagi.</p>
<h2>Apa yang kami temui apabila kami tiba</h2>
<p>Permukaan jalan adalah kerja membuka jalan Malaysia yang tipikal: lapisan atas asfalt di atas asas konkrit bertetulang lama dengan agregat campuran dan besi tetulang yang tidak konsisten. Dua lapisan itu dipotong dengan sangat berbeza. Mata pisau yang dioptimumkan untuk satu sedang bekerja menentang satu lagi.</p>
<p>Kontraktor itu bermula dengan mata pisau asfalt tujuan umum kerana itulah lapisan permukaan. Masalahnya, sebaik sahaja mata pisau itu mencapai konkrit bertetulang di bawah, ikatannya salah, segmen tidak dapat menahan lelasan terhadap besi tetulang, dan haba daripada bahan yang lebih keras itu merosakkan kimpalan segmen.</p>
<p>Apabila kami tiba, tapak hampir senyap. Krew kawalan lalu lintas masih di kedudukan. Pekerja berdiri di tepi parit, menunggu. Operator telah berhenti memotong kerana dia tidak dapat membenarkan merosakkan mata pisau lagi.</p>
<h2>Apa yang berubah</h2>
<p>Penyelesaiannya adalah perubahan spesifikasi. Segmen yang dikimpal laser, yang menahan kejutan haba jauh lebih baik daripada alternatif yang dibrazkan, dan mata pisau dengan perlindungan undercut di simpang segmen dengan teras, yang menghalang kehilangan segmen besar-besaran yang merosakkan mata pisau sebelumnya apabila ia terkena zon besi tetulang yang tebal.</p>
<p>Kami bawa dua mata pisau. Yang pertama dipasang, mula memotong, dan kami pun memerhati. Untuk beberapa minit pertama tiada siapa bercakap. Kelajuan pemotongan stabil. Buburan air mengalir. Segmen tidak pecah.</p>
<p>Apabila kabel telah masuk dan jalan ditutup, subuh mula menjelma di langit.</p>
<h2>Apa yang kontraktor itu kata</h2>
<p>Apabila jadual telah selamat dan krew kawalan lalu lintas mula berkemas, kontraktor itu datang kepada kami. Dia letih dengan cara khusus yang datang selepas hampir-hampir gagal. Senyap. Tidak melebih-lebih.</p>
<p>Apa yang dia kata tidak panjang. Lebih kurang: "Kalau kamu tak datang malam ni, betul-betul habis saya."</p>
<p>Saya memikirkan ayat itu banyak kali sejak itu. Kerana apa yang dia berterima kasih kepada kami bukan mata pisau itu. Mata pisau itu tiga ratus lima puluh ringgit. Mata pisau itu, dalam sapuan besar kerjayanya, boleh diganti.</p>
<p>Apa yang dia berterima kasih kepada kami adalah hakikat bahawa seseorang telah mengangkat telefon selepas tengah malam. Seseorang telah membuka kedai pada pukul 1 pagi. Seseorang telah memandu ke tapak membuka jalan dengan spesifikasi yang betul dan tinggal sehingga pemotongan stabil.</p>
<blockquote>Kontraktor tidak selalu memerlukan pembekal. Kadang-kadang mereka memerlukan seseorang yang sanggup berdiri di sisi mereka apabila kerja menjadi susah.</blockquote>
<h2>Pengajarannya</h2>
<p>Industri pemotongan, dalam bentuk konvensionalnya, adalah perniagaan waktu siang. Telefon masuk ke peti suara selepas 6 petang. Kedai tutup pada 6.30 petang. Wakil jualan bekerja Isnin hingga Jumaat. Kakitangan teknikal tersedia "pada waktu pejabat."</p>
<p>Ini tidak mengapa untuk kebanyakan potongan. Tetapi potongan yang menentukan kerjaya kontraktor, pembukaan jalan malam, pemasangan utiliti kecemasan, projek dengan kontraktor utama yang tidak menerima kelewatan, tidak berlaku pada waktu pejabat.</p>
<p>Potongan yang menentukan kerjaya berlaku pada waktu yang tidak selesa. Dan pembekal yang boleh dihubungi pada waktu tidak selesa itu adalah, dalam tempoh bertahun-tahun, pembekal yang kontraktor itu percayai dengan semua perkara lain.</p>
<p>Ini bukan kedudukan pemasaran. Ini adalah keputusan operasi. Untuk menjadi jenis pembekal yang mengangkat telefon pada tengah malam, anda perlu sebenar-benarnya mengangkat telefon pada tengah malam. Tiada jalan pintas. Tiada sistem automatik yang menggantikannya.</p>
<p>Ia lebih mahal. Ia berbaloi dalam beberapa dekad.</p>
`.trim()

const NOTE_03_EN = `
<p>This is a piece about something Coolman got wrong. We are publishing it because the alternative, pretending it did not happen, or burying it inside generic marketing language about "continuous improvement," would betray the principle the company actually runs on.</p>
<p>The principle is: the worksite tells the truth. Sometimes the worksite tells the truth about us.</p>
<p>We had a new product specification we believed in. The factory data on the bond formulation looked excellent. The lab numbers were strong. The pre-production cuts in our own controlled testing performed within spec.</p>
<p>We pushed it out faster than we should have.</p>
<p>Specifically, we relied on the factory specification and our internal testing rather than putting the new specification through a full site-testing programme across the range of conditions our customers actually work in. We knew, intellectually, that site conditions vary. We knew that aggregate composition shifts between regions, between batches, between quarries. We knew that the controlled testing environment is a poor predictor of the kind of inconsistency a contractor sees across a real project.</p>
<p>We told ourselves the data was strong enough to compensate. It was not.</p>
<h2>What the contractors saw</h2>
<p>The complaints started arriving within a few weeks of the product entering circulation.</p>
<p>They were not catastrophic complaints. No blades exploding, no injuries, nothing that crossed into a safety problem. They were the more insidious kind of complaint: the cuts were not consistent. A blade would perform beautifully on one site and disappointingly on another. Segments would wear at different rates in apparently similar conditions. The cutting speed would vary in ways the contractors could not predict.</p>
<p>This is, in some respects, worse than a clean failure. A blade that simply does not work is identifiable. A blade that works sometimes, in patterns the contractor cannot anticipate, undermines the contractor's ability to plan. It costs them confidence in their own scheduling. It costs them the trust of their main contractors. It costs them sleep.</p>
<p>And, eventually, it costs the supplier the contractor's business.</p>
<h2>What we did not do</h2>
<p>In situations like this, there are several conventional responses available to a supplier. None of them are honest.</p>
<p>The first is to blame the operator. Argue that the cuts that went well prove the product is fine, and the cuts that went badly must be down to operator error, machine condition, water management, anything other than the product specification.</p>
<p>The second is to blame the machine. Argue that the variance in performance reflects variance in the contractor's equipment, not the blade.</p>
<p>The third is to blame the worksite conditions. Argue that the aggregate, the temperature, the cutting pattern, the rebar density, all factors outside the supplier's control, explain the inconsistency.</p>
<p>The fourth is to do nothing and hope the complaints fade.</p>
<p>Many suppliers, when this kind of problem arises, take one or several of these routes. They are easier than the alternative. They preserve revenue in the short term. They keep the product on the market while the problem quietly works itself out. We did not take any of those routes.</p>
<h2>What we did</h2>
<p>We recalled the product. Quietly, but completely. We contacted every customer the affected batch had been shipped to, took back what was unused, and replaced it at our cost.</p>
<p>We went to the sites where the inconsistency had been worst. We tested the actual conditions there. We collected aggregate samples. We measured slurry chemistry. We watched the cutting in person. We took the findings back to the factory.</p>
<p>We absorbed the loss. The financial cost of the recall, the replacement, and the lost margin was significant for a company of our size at that stage.</p>
<p>And we changed the specification. The bond formulation that came out of the post-recall work was different from the one we had launched with. It was more conservative in some respects. It was matched more carefully to the realities of Malaysian site conditions. It performed consistently.</p>
<h2>What changed internally</h2>
<p>The product failure was finite. The internal change was permanent.</p>
<p>After that recall, Coolman's testing protocols stopped being a function of how confident we were in the factory data. They became a function of how variable the site conditions could be, which, in our market, is considerable.</p>
<p>Every new specification, since that recall, has been tested in actual cutting environments across a range of Malaysian sites before being shipped. Not as a marketing exercise. As a precondition for release. If the site testing reveals inconsistency we did not see in the lab, the product does not ship until the inconsistency is understood and addressed.</p>
<p>This makes our product development cycle slower than some competitors'. It means we sometimes lose first-mover positioning on new applications. It means our R&amp;D is more expensive than it strictly has to be.</p>
<p>It also means that, since that recall, we have not had a customer experience the kind of unpredictable performance variance that triggered it.</p>
<blockquote>What destroys a brand isn't a single loss. It's the moment a customer stops believing you.</blockquote>
<h2>The lesson</h2>
<p>A specification on paper, however carefully designed, is a prediction about conditions that do not yet exist in the form they will take on a contractor's worksite. The factory test environment is controlled, consistent, and predictive of itself. It is a poor predictor of what happens when the blade meets a real granite-heavy aggregate, in a real Malaysian heat profile, on a real machine that has been worked hard for years, with a real operator who is tired, on a real schedule that does not bend.</p>
<p>The only thing that predicts what a blade will do on a site is putting the blade on a site. Many of them. In conditions that mirror what the actual customer base is working in.</p>
<p>This is not expensive in the long run. It is, in fact, the only sustainable way to run a diamond tools company that intends to be in the trade for another two decades. It is just expensive in the short run, in development time, in product launches deferred, in the temptation to ship before testing is complete.</p>
<p>The product launch that triggered that recall, all those years ago, taught us this in a way we could not ignore. We pay attention to it now.</p>
`.trim()

const NOTE_03_BM = `
<p>Ini adalah artikel tentang sesuatu yang Coolman buat salah. Kami menerbitkannya kerana alternatif, berpura-pura ia tidak berlaku, atau menyembunyikannya di dalam bahasa pemasaran generik tentang "penambahbaikan berterusan," akan mengkhianati prinsip yang sebenarnya menjadi pegangan syarikat ini.</p>
<p>Prinsipnya adalah: tapak kerja memberitahu kebenaran. Kadang-kadang tapak kerja memberitahu kebenaran tentang kami.</p>
<p>Kami mempunyai spesifikasi produk baharu yang kami percayai. Data kilang tentang formulasi ikatan kelihatan sangat baik. Nombor makmal kuat. Potongan pra-pengeluaran dalam ujian terkawal kami sendiri berprestasi dalam spesifikasi.</p>
<p>Kami melancarkannya lebih cepat daripada yang sepatutnya. Khususnya, kami bergantung pada spesifikasi kilang dan ujian dalaman kami sendiri, bukannya melalui spesifikasi baharu itu dengan program ujian tapak penuh merentas julat keadaan di mana pelanggan kami benar-benar bekerja. Kami tahu, secara intelektual, bahawa keadaan tapak berbeza. Kami tahu komposisi agregat berubah antara wilayah, antara kumpulan, antara kuari.</p>
<p>Kami memberitahu diri kami sendiri bahawa data itu cukup kuat untuk menampung. Ia tidak cukup.</p>
<h2>Apa yang kontraktor lihat</h2>
<p>Aduan mula tiba dalam beberapa minggu selepas produk itu memasuki edaran. Ia bukan aduan bencana. Tiada mata pisau meletup, tiada kecederaan, tiada apa yang menjadi masalah keselamatan. Ia adalah jenis aduan yang lebih halus: potongan tidak konsisten. Mata pisau itu akan berprestasi cantik di satu tapak dan mengecewakan di tapak lain. Segmen akan haus pada kadar yang berbeza dalam keadaan yang nampak serupa.</p>
<p>Ini, dalam beberapa hal, lebih teruk daripada kegagalan yang jelas. Mata pisau yang tidak berfungsi langsung boleh dikenal pasti. Mata pisau yang kadang-kadang berfungsi, dalam corak yang kontraktor tidak boleh jangka, melemahkan keupayaan kontraktor untuk merancang.</p>
<h2>Apa yang kami tidak buat</h2>
<p>Dalam situasi seperti ini, terdapat beberapa respons konvensional yang tersedia kepada pembekal. Tiada satu pun yang jujur.</p>
<p>Yang pertama adalah menyalahkan operator. Berhujah bahawa potongan yang berjalan dengan baik membuktikan produk itu OK, dan potongan yang berjalan teruk mestilah disebabkan kesilapan operator, keadaan mesin, pengurusan air, apa-apa selain spesifikasi produk.</p>
<p>Yang kedua adalah menyalahkan mesin. Yang ketiga adalah menyalahkan keadaan tapak kerja. Yang keempat adalah berdiam diri dan berharap aduan akan reda.</p>
<p>Banyak pembekal, apabila masalah jenis ini timbul, mengambil salah satu daripada laluan ini. Ia lebih mudah daripada alternatif. Ia memelihara hasil dalam jangka pendek. Kami tidak mengambil mana-mana laluan itu.</p>
<h2>Apa yang kami buat</h2>
<p>Kami menarik balik produk itu. Diam-diam, tetapi sepenuhnya. Kami menghubungi setiap pelanggan yang menerima kumpulan yang terjejas, mengambil semula yang tidak digunakan, dan menggantikannya dengan kos kami sendiri.</p>
<p>Kami pergi ke tapak di mana ketidakkonsistenan paling teruk. Kami menguji keadaan sebenar di sana. Kami mengumpul sampel agregat. Kami mengukur kimia buburan air. Kami memerhati pemotongan secara peribadi. Kami membawa penemuan kembali ke kilang.</p>
<p>Kami menyerap kerugian. Kos kewangan penarikan balik, penggantian, dan margin yang hilang adalah ketara untuk syarikat saiz kami pada peringkat itu.</p>
<p>Dan kami menukar spesifikasi. Formulasi ikatan yang muncul daripada kerja selepas penarikan balik adalah berbeza daripada yang kami lancarkan. Ia berprestasi konsisten.</p>
<h2>Apa yang berubah secara dalaman</h2>
<p>Kegagalan produk adalah terhad. Perubahan dalaman adalah kekal.</p>
<p>Selepas penarikan balik itu, protokol ujian Coolman berhenti menjadi fungsi seberapa yakin kami terhadap data kilang. Ia menjadi fungsi seberapa berubah keadaan tapak boleh menjadi, yang, dalam pasaran kami, adalah ketara.</p>
<p>Setiap spesifikasi baharu, sejak penarikan balik itu, telah diuji dalam persekitaran pemotongan sebenar merentas pelbagai tapak Malaysia sebelum dihantar. Bukan sebagai latihan pemasaran. Sebagai prasyarat untuk pelancaran.</p>
<blockquote>Apa yang memusnahkan jenama bukan satu kerugian. Ia adalah saat pelanggan berhenti mempercayai anda.</blockquote>
<h2>Pengajarannya</h2>
<p>Spesifikasi di atas kertas, walau bagaimana telitinya direka bentuk, adalah ramalan tentang keadaan yang belum wujud dalam bentuk yang akan diambilnya di tapak kerja kontraktor. Persekitaran ujian kilang adalah terkawal, konsisten, dan boleh diramalkan untuk dirinya sendiri. Ia adalah peramal yang lemah tentang apa yang berlaku apabila mata pisau bertemu agregat sebenar kaya granit, dalam profil haba Malaysia sebenar, pada mesin sebenar yang telah dikerjakan keras selama bertahun-tahun.</p>
<p>Satu-satunya perkara yang meramalkan apa yang mata pisau akan buat di tapak adalah meletakkan mata pisau di tapak. Banyak daripadanya. Dalam keadaan yang mencerminkan apa yang pelanggan sebenar sedang kerjakan.</p>
<p>Pelancaran produk yang mencetuskan penarikan balik itu, bertahun-tahun dahulu, mengajar kami ini dengan cara yang tidak boleh kami abaikan. Kami memberi perhatian kepadanya sekarang.</p>
`.trim()

// ─────────────────────────────────────────────────────────────────────────────
// Drafts
// ─────────────────────────────────────────────────────────────────────────────

interface FieldNoteSeed {
  slug: string
  noteNumber: string
  readTimeMin: number
  title: string
  titleBM: string
  excerpt: string
  excerptBM: string
  application: string
  applicationBM: string
  content: string
  contentBM: string
  editorialNotes: string
}

const drafts: FieldNoteSeed[] = [
  {
    slug: 'field-note-01-pile-cutting',
    noteNumber: '№ 001',
    readTimeMin: 9,
    title: "When the contractor stopped trying, and just called.",
    titleBM: 'Apabila kontraktor berhenti mencuba, dan terus menelefon.',
    excerpt:
      "A reinforced concrete pile-cutting job that the contractor had nearly given up on. Three blade brands tried. Segments burning out. A schedule that wasn't going to bend. What we found when we walked the site was that the blade had never been the only problem.",
    excerptBM:
      'Kerja memotong cerucuk konkrit bertetulang yang hampir-hampir kontraktor itu menyerah kalah. Tiga jenama mata pisau dicuba. Segmen terbakar. Jadual yang tidak boleh diubah. Apa yang kami temui apabila kami berjalan di tapak adalah mata pisau itu tidak pernah menjadi satu-satunya masalah.',
    application: 'Wet cut, Reinforced concrete',
    applicationBM: 'Potongan basah, Konkrit bertetulang',
    content: NOTE_01_EN,
    contentBM: NOTE_01_BM,
    editorialNotes:
      'Placeholders to confirm with Alan: (1) year of the job, (2) site/project name (or keep generic if NDA concerns), (3) three competitor blade brands (recommend keeping anonymous), (4) contractor name (recommend anonymous), (5) Coolman blade SKU (Alan to decide whether to name).',
  },
  {
    slug: 'field-note-02-midnight-road-opening',
    noteNumber: '№ 002',
    readTimeMin: 7,
    title: "\"If I don't finish tonight, I'm done.\"",
    titleBM: '"Kalau saya tak siap malam ni, habislah saya."',
    excerpt:
      "A midnight call from a contractor on a night road-opening job. The wrong blade for mixed asphalt and reinforced concrete. A traffic-control window closing at dawn. A main contractor that doesn't accept excuses. What it looks like when a small specification choice becomes someone's entire livelihood.",
    excerptBM:
      'Panggilan tengah malam daripada kontraktor di kerja membuka jalan waktu malam. Mata pisau yang salah untuk asfalt bercampur dengan konkrit bertetulang. Tempoh kawalan lalu lintas yang akan tamat pada waktu subuh. Apa yang berlaku apabila satu pilihan spesifikasi kecil menjadi seluruh mata pencarian seseorang.',
    application: 'Road cut, Asphalt over RC',
    applicationBM: 'Potongan jalan, Asfalt atas konkrit bertetulang',
    content: NOTE_02_EN,
    contentBM: NOTE_02_BM,
    editorialNotes:
      'Placeholders to confirm with Alan: (1) location (generic OK), (2) year, (3) the utility being installed (fibre, power, telecom), (4) Coolman blade SKU, (5) contractor status now ("ever since" if still active; "for many years" if moved on). Tone check: closing paragraph is on the emotional side. Alan to decide whether the article should end at "It pays back over decades" instead.',
  },
  {
    slug: 'field-note-03-the-recall',
    noteNumber: '№ 003',
    readTimeMin: 6,
    title: "We trusted the factory spec. We shouldn't have.",
    titleBM: 'Kami percayakan spesifikasi kilang. Sepatutnya kami tidak.',
    excerpt:
      'A piece about a Coolman failure, not a Coolman success. A batch went out under-tested. Performance was inconsistent. Some customers were unhappy. What we did next is what changed how we operate, and changed what we will and will not claim about a product on paper.',
    excerptBM:
      'Sebuah artikel tentang kegagalan Coolman, bukan kejayaan Coolman. Satu kumpulan dihantar tanpa cukup ujian. Prestasi tidak konsisten. Sebahagian pelanggan tidak gembira. Apa yang kami buat selepas itu adalah yang mengubah cara kami beroperasi.',
    application: 'Specification, Testing, Accountability',
    applicationBM: 'Spesifikasi, Ujian, Akauntabiliti',
    content: NOTE_03_EN,
    contentBM: NOTE_03_BM,
    editorialNotes:
      'WARNING: Alan must actively approve publishing this article before status changes from draft to published. See content-drafts/session-2-field-notes.md. Placeholders to confirm: (1) year of the recall, (2) product family/specification (Alan to decide whether to name), (3) scale of the recall (units, cost), (4) whether it was batch-specific or company-wide. Sensitive content — describes a past Coolman failure honestly. Do not publish without Alan sign-off.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────

async function run() {
  const payload = await getPayload({ config })

  log(`seeding ${drafts.length} field notes...`)
  let created = 0
  let skipped = 0
  let failed = 0

  for (const draft of drafts) {
    try {
      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: draft.slug } },
        limit: 1,
        depth: 0,
      })

      if (existing.docs.length > 0) {
        skipped += 1
        log(`  - skip (exists): ${draft.slug}`)
        continue
      }

      await payload.create({
        collection: 'posts',
        data: {
          slug: draft.slug,
          status: 'draft',
          noteNumber: draft.noteNumber,
          readTimeMin: draft.readTimeMin,
          title: draft.title,
          titleBM: draft.titleBM,
          excerpt: draft.excerpt,
          excerptBM: draft.excerptBM,
          application: draft.application,
          applicationBM: draft.applicationBM,
          content: draft.content,
          contentBM: draft.contentBM,
          editorialNotes: draft.editorialNotes,
        } as any,
      })
      created += 1
      log(`  + created (draft): ${draft.slug}`)
    } catch (err: any) {
      failed += 1
      log(`  x failed: ${draft.slug}: ${err?.message || err}`)
    }
  }

  log(`done. created=${created} skipped=${skipped} failed=${failed}`)
  log('All three notes are status=draft. Alan must actively approve №03 before publishing.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
