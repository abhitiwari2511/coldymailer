import * as motion from "motion/react-client"
import {
  UploadCloud, Sparkles, Mail, LayoutDashboard, Megaphone,
  FileEdit, Users, BarChart, Settings, ChevronRight, X, Check,
  RefreshCw, Send, ChevronDownIcon as ChevronDown, CheckCircle2, Reply
} from "lucide-react"

const SectionEyebrow = ({ label, tag }: { label: string; tag?: string }) => (
  <div className="flex items-center gap-3">
    <span className="w-1.5 h-1.5 rounded-full bg-[#3D81E3]" />
    <span className="text-white font-medium text-sm tracking-wide">{label}</span>
    {tag && <span className="px-2 py-0.5 rounded-full border border-white/10 text-white/50 text-xs font-medium">{tag}</span>}
  </div>
)

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)
const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
)
const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
)

export function Features() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 pb-24 md:pb-32 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 rounded-2xl md:rounded-3xl border border-white/10 glass-panel overflow-hidden shadow-2xl"
        >
          <div className="h-12 border-b border-white/5 flex items-center px-4 bg-white/[0.02]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="absolute inset-x-0 mx-auto text-center pointer-events-none flex items-center justify-center gap-2 text-xs text-white/40 font-medium">
              <LockIcon className="w-3 h-3" /> coldymailer.ai/campaigns/new
            </div>
          </div>

          <div className="flex flex-col md:flex-row h-auto md:h-[650px]">
            <div className="w-full md:w-56 border-r border-white/5 bg-black/40 flex flex-col shrink-0">
              <div className="p-4 py-6">
                <div className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors text-sm font-medium">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </div>
                <div className="flex items-center gap-3 px-3 py-2 text-white bg-brand/10 text-brand rounded-lg cursor-pointer transition-colors text-sm font-medium mt-1">
                  <Megaphone className="w-4 h-4" /> Campaigns
                </div>
                <div className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors text-sm font-medium mt-1">
                  <FileEdit className="w-4 h-4" /> Templates
                </div>
                <div className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors text-sm font-medium mt-1">
                   <Users className="w-4 h-4" /> Contacts
                </div>
                <div className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors text-sm font-medium mt-1">
                  <BarChart className="w-4 h-4" /> Analytics
                </div>
                <div className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors text-sm font-medium mt-1">
                  <Settings className="w-4 h-4" /> Settings
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-transparent">
              <div className="flex-1 flex flex-col border-r border-white/5 min-w-0">
                <div className="h-14 border-b border-white/5 flex items-center px-6 shrink-0">
                  <div className="flex items-center text-sm">
                    <span className="text-brand font-medium">New Campaign</span>
                    <ChevronRight className="w-4 h-4 mx-2 text-white/30" />
                    <span className="text-white/50">Draft</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Describe your intent</h3>
                      <p className="text-xs text-white/50 mb-3">What kind of role are you targeting?</p>
                      <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 focus-within:border-brand/50 transition-colors">
                        <textarea
                          className="w-full bg-transparent text-sm text-white resize-none outline-none min-h-[80px]"
                          defaultValue="Looking for a Frontend Developer Internship. Mention my experience in React, Next.js, and building full-stack projects."
                          readOnly
                        />
                      </div>
                      <button className="w-full mt-3 flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 text-white rounded-lg py-2.5 text-sm font-medium transition-all shadow-[0_0_15px_rgba(61,129,227,0.3)]">
                        <Sparkles className="w-4 h-4" /> Generate Drafts
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Tone</h3>
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 rounded-md border border-brand text-brand bg-brand/10 text-xs font-medium cursor-pointer">Professional</span>
                        <span className="px-3 py-1.5 rounded-md border border-white/10 text-white/50 hover:bg-white/5 text-xs font-medium cursor-pointer">Casual</span>
                        <span className="px-3 py-1.5 rounded-md border border-white/10 text-white/50 hover:bg-white/5 text-xs font-medium cursor-pointer">Friendly</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Attachments</h3>
                      <div className="border border-white/10 bg-white/[0.03] rounded-lg p-3 flex items-center justify-between group cursor-pointer hover:bg-white/[0.05] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#ff5f57]/20 p-2 rounded-md">
                            <FileTextIcon className="w-4 h-4 text-[#ff5f57]" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Resume_DavidLim.pdf</div>
                            <div className="text-xs text-white/40 mt-0.5">PDF · 1.2 MB</div>
                          </div>
                        </div>
                        <X className="w-4 h-4 text-white/30 group-hover:text-white/70" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden shadow-inner">
                    <div className="h-10 border-b border-white/10 bg-white/[0.03] flex items-center justify-between px-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                        <ChevronLeftIcon className="w-3.5 h-3.5 cursor-pointer" /> Generated Preview
                      </div>
                      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#28c840] bg-[#28c840]/10 px-2 py-0.5 rounded-full font-semibold">
                        <Check className="w-3 h-3" /> Ready
                      </span>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto text-sm text-white/80 leading-relaxed font-sans scrollbar-hide">
                      <div className="mb-4">
                        <span className="text-white/40">Subject:</span> Application for Frontend Developer Internship
                      </div>
                      <div className="space-y-4 text-white/90">
                        <p>Hi <span className="text-brand font-medium bg-brand/10 px-1 rounded">{"{{recruiter_name}}"}</span>,</p>
                        <p>I hope you're doing well. I came across your team's work on <span className="text-brand font-medium bg-brand/10 px-1 rounded">{"{{company}}"}</span> and was really impressed by the scale and impact of your engineering.</p>
                        <p>I'm a Computer Science student with hands-on experience in React, Next.js, and building responsive, user-friendly web applications. I'm passionate about creating real-world solutions and would love the opportunity to contribute and learn from your team.</p>
                        <p>I've attached my resume for your review. I'd be excited to discuss how I can add value to your team.</p>
                        <p>Best regards,<br/>David Lim</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-72 bg-black/20 p-6 flex flex-col shrink-0 overflow-y-auto">
                <h3 className="text-sm font-medium mb-3">Send to</h3>
                <p className="text-xs text-white/50 mb-3">Add recipients to your campaign.</p>
                <div className="border border-white/10 bg-white/[0.04] p-2 rounded-lg flex flex-col gap-2 min-h-[120px] shadow-inner mb-2">
                  <span className="flex items-center gap-2 bg-white/5 border border-white/10 pl-2 pr-1 py-1 rounded text-xs">
                    hr@google.com <X className="w-3.5 h-3.5 text-white/50 cursor-pointer hover:text-white" />
                  </span>
                  <span className="flex items-center gap-2 bg-white/5 border border-white/10 pl-2 pr-1 py-1 rounded text-xs w-max">
                    sarah@stripe.com <X className="w-3.5 h-3.5 text-white/50 cursor-pointer hover:text-white" />
                  </span>
                  <span className="flex items-center gap-2 bg-white/5 border border-white/10 pl-2 pr-1 py-1 rounded text-xs w-max">
                    careers@vercel.com <X className="w-3.5 h-3.5 text-white/50 cursor-pointer hover:text-white" />
                  </span>
                </div>
                <div className="text-xs text-white/40 flex justify-between mb-8">
                  <span>Total recipients</span>
                  <span className="text-white">3</span>
                </div>

                <button className="w-full mt-auto flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 rounded-lg py-3 text-sm font-semibold transition-all">
                  <Send className="w-4 h-4" /> Finalize & Dispatch
                </button>
              </div>
            </div>
          </div>

          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 1.5, duration: 0.6 }}
             className="hidden lg:flex absolute top-1/3 -left-32 z-20 glass-panel bg-black/60 p-4 rounded-xl flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 w-48"
          >
            <div className="text-xs font-medium text-white/90 mb-4">Campaign status</div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="text-xs text-white/50">Dispatched</div>
                <div className="text-lg font-semibold leading-none">128</div>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-xs text-brand">Opened (68%)</div>
                <div className="text-lg font-semibold leading-none text-brand">87</div>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-xs text-[#28c840]">Replied (18%)</div>
                <div className="text-lg font-semibold leading-none text-[#28c840]">24</div>
              </div>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 1.7, duration: 0.6 }}
             className="hidden xl:flex absolute bottom-1/4 -right-16 z-20 glass-panel bg-black/80 p-4 rounded-xl flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 w-64"
          >
            <div className="text-xs font-semibold text-white/90 mb-3 border-b border-white/10 pb-2">Recent network activity</div>
            <div className="space-y-4 mt-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-[#28c840]/20 p-1.5 rounded-full text-[#28c840]">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-xs font-medium text-white/90">Email opened</div>
                  <div className="text-[10px] text-white/50">sarah@stripe.com · 2m ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-[#00d2ff]/20 p-1.5 rounded-full text-[#00d2ff]">
                   <Reply className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-xs font-medium text-white/90">Reply received</div>
                  <div className="text-[10px] text-white/50">hr@ramp.com · 14m ago</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <SectionEyebrow label="Workflow" tag="AI-native" />
            <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
              One resume. <br/> Infinite tailor-fit applications.
            </h2>
            <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
              Stop copy-pasting generic cover letters. ColdyMailer AI extracts your skills from one PDF and weaves them seamlessly into highly relevant outreach emails for each specific company.
            </p>

            <div className="flex flex-wrap gap-2 mt-8">
              {["Single Resume Upload", "Cloudinary Storage", "Dynamic Placeholders", "Deep Context Inference"].map(chip => (
                <span key={chip} className="text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="glass-panel rounded-2xl p-6"
          >
            <div className="flex flex-col gap-4">
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-brand/20 p-2 rounded-lg"><UploadCloud className="w-4 h-4 text-brand" /></div>
                  <span className="font-semibold text-sm">1. Secure Storage</span>
                </div>
                <p className="text-sm text-white/50">Upload your PDF once. It's stored securely via Cloudinary and parsed instantly to build your candidate profile.</p>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#A4F4FD]/20 p-2 rounded-lg"><Sparkles className="w-4 h-4 text-[#A4F4FD]" /></div>
                  <span className="font-semibold text-sm">2. Claude/OpenAI Generation</span>
                </div>
                <p className="text-sm text-white/50">State of the art models analyze the target company and inject your most relevant projects from your resume into the draft.</p>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#28c840]/20 p-2 rounded-lg"><Mail className="w-4 h-4 text-[#28c840]" /></div>
                  <span className="font-semibold text-sm">3. Native Gmail Sending</span>
                </div>
                <p className="text-sm text-white/50">Emails aren't spoofed. They are sent directly from your connected Gmail via OAuth—ensuring maximum deliverability.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Landed roles at top companies</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "I sent 50 highly personalized emails in 10 minutes. I got 4 interviews and locked my summer internship at Vercel.",
              name: "Sarah Chen",
              role: "CS Junior · Stanford",
              company: "SWE Intern @ Vercel"
            },
            {
              quote: "The way the AI references specific projects from my resume changed everything. It sounds exactly like me, just way more confident.",
              name: "Marcus Johnson",
              role: "Senior · NYU",
              company: "Data Analyst @ Stripe"
            },
            {
              quote: "Previously, I would procrastinate applying because rewriting covers letters was draining. This made it a single click.",
              name: "Elena Rodriguez",
              role: "Recent Grad · UT Austin",
              company: "Frontend Eng @ Figma"
            }
          ].map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between"
            >
              <blockquote className="text-sm text-white/80 leading-[1.6]">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-white/10">
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-xs text-white/50 mt-0.5">{t.role}</div>
                <div className="text-xs text-brand font-semibold tracking-wide uppercase mt-2">{t.company}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>
    </>
  )
}