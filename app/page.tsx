"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Brain, Zap, Target, BarChart3, Clock, Youtube, Twitter, Instagram } from "lucide-react"

export default function ExecutiveClarityLanding() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with email:', email);
    setIsSubmitting(true)
    setError(null)

    try {
      const formId = process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID;
      console.log('Using form ID:', formId);
      
      if (!formId) {
        throw new Error('ConvertKit form ID is not configured');
      }
      
      const url = `https://app.convertkit.com/forms/${formId}/subscriptions`;
      console.log('Preparing to submit to URL:', url);

      const formData = new FormData();
      formData.append('email_address', email);
      console.log('Form data prepared');

      console.log('Sending request to ConvertKit...');
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json().catch(e => {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid response from server');
      });
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Failed to subscribe (${response.status})`);
      }

      console.log('Subscription successful, setting success state');
      setIsSuccess(true);
      setEmail('');
      
      // Show success message for 2 seconds before redirecting
      console.log('Subscription successful - showing success message');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to thank you page
      window.location.href = '/thank-you';
    } catch (err) {
      console.error('Subscription error:', err);
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>

        <div className="relative container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side: Headline and problem */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Finally, A Simple System That Keeps You Razor-Sharp All Day
                </h1>
                <h2 className="text-xl lg:text-2xl text-blue-100 font-light">
                  The 3-Step Executive Clarity System That Prevents Decision Fatigue
                </h2>
              </div>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-4 text-amber-200">You know that feeling...</h3>
                  <p className="text-lg mb-4 leading-relaxed">
                    It's 2 PM, you've been in meetings since 9 AM, and someone asks you to make an important decision.
                  </p>
                  <p className="text-lg font-semibold leading-relaxed">
                    Your brain feels like it's running through mud. The sharp, strategic thinking you had this morning?{" "}
                    <strong className="text-amber-300">Gone.</strong>
                  </p>
                </CardContent>
              </Card>

              <p className="text-xl font-semibold text-amber-200 leading-relaxed">
                What if there was a way to maintain razor-sharp decision-making from dawn to dusk?
              </p>
            </div>

            {/* Right side: Opt-in form */}
            <div className="animate-fade-in-up animation-delay-300">
              <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border-0">
                <CardContent className="p-10">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-slate-800 mb-3">Get Your FREE Executive Clarity System</h3>
                    <p className="text-lg text-slate-600">Usually costs $200+ per hour. Today it's FREE.</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {[
                      "The Complete 3-Step Clarity Cheat-Sheet (beautifully designed PDF)",
                      "Morning Clarity Checklist (7 strategic steps for peak performance)",
                      "Midday Reset Protocol (5-minute cognitive recharge system)",
                      "Evening Review Ritual (extract maximum learning from each day)",
                      "Bonus: Enhanced Mental Clarity Training (neuroenergizer.com access)",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting || isSuccess}
                      className="h-14 text-lg border-2 border-slate-200 focus:border-blue-600 rounded-xl"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className={`w-full h-16 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                        isSuccess
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:-translate-y-1'
                      }`}
                    >
                      {isSubmitting
                        ? 'Sending...'
                        : isSuccess
                        ? '✅ Check Your Email!'
                        : '🚀 Send Me The Executive Clarity System'}
                    </Button>
                  </form>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {isSuccess && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                      Redirecting you to the download page...
                    </div>
                  )}

                  <div className="flex justify-center gap-8 mt-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>100% Free</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>Instant Download</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>No Spam Ever</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-bold text-center text-slate-800 mb-12">
            Here's What's Really Happening to Your Executive Brain:
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              "Decision fatigue kicks in after just 2-3 hours, making every choice harder",
              "Mental fog clouds your judgment during crucial afternoon meetings",
              "Cognitive overload from constant context switching between priorities",
              "Energy crashes that leave you running on willpower alone",
              "Poor decisions that you wouldn't make with a fresh mind",
            ].map((problem, index) => (
              <Card
                key={index}
                className="border-l-4 border-l-slate-400 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <p className="text-slate-700">{problem}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-blue-700 mb-6">
              Introducing: The 3-Step Executive Clarity Cheat-Sheet
            </h3>
            <p className="text-xl text-slate-600 mb-4">
              This isn't another productivity hack or time management system.
            </p>
            <p className="text-2xl font-bold text-slate-800">
              It's a science-based cognitive maintenance protocol designed specifically for high-level executives who
              need to make important decisions all day long.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "Morning Clarity Checklist",
                description:
                  "7 strategic steps that prime your brain for peak executive performance (complete by 8 AM for maximum impact)",
              },
              {
                icon: Zap,
                title: "Midday Reset Protocol",
                description:
                  "The 5-minute cognitive recharge system that prevents afternoon brain fog (works even during busy days)",
              },
              {
                icon: Target,
                title: "Evening Review Ritual",
                description: "How to extract maximum learning from each day while pre-loading tomorrow's success",
              },
              {
                icon: BarChart3,
                title: "The Neuroscience Behind It All",
                description: 'Why this 3-step system works better than caffeine, willpower, or "just pushing through"',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-t-blue-600"
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <feature.icon className="h-16 w-16 mx-auto text-blue-600" />
                  </div>
                  <h5 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h5>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-bold text-center mb-12">What Changes When You Use This System:</h3>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              'WEEK 1: You\'ll notice sharper thinking during afternoon meetings and fewer "brain fog" moments',
              "WEEK 2: Important decisions become easier and you'll feel more confident in your choices",
              "WEEK 3: Your team starts noticing your consistent leadership presence throughout the day",
              "WEEK 4: You're making strategic moves that compound into lasting competitive advantages",
            ].map((benefit, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-amber-300 flex-shrink-0 mt-1" />
                    <p className="text-lg font-semibold">{benefit}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardContent className="p-10 text-center">
              <h4 className="text-3xl font-bold mb-8">The Executive Edge Promise:</h4>
              <div className="grid md:grid-cols-2 gap-6 text-lg">
                <div className="flex items-center gap-3">
                  <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded-full font-bold">
                    40% better decision quality
                  </span>
                  <span>throughout the day (research-backed)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded-full font-bold">
                    2x faster advancement
                  </span>
                  <span>compared to executives who don't do evening reviews</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded-full font-bold">
                    Enhanced mental clarity
                  </span>
                  <span>that lasts from morning meetings to evening strategy sessions</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded-full font-bold">
                    Sustainable cognitive performance
                  </span>
                  <span>without relying on caffeine or stimulants</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-bold text-center text-slate-800 mb-8">This System Is Based On Research From:</h3>
          <div className="text-center text-xl font-semibold text-slate-600 mb-12">
            <span className="text-blue-700">Harvard Medical School</span> •{" "}
            <span className="text-blue-700">Stanford Research</span> •{" "}
            <span className="text-blue-700">Mayo Clinic</span> •{" "}
            <span className="text-blue-700">Fortune 500 Companies</span>
          </div>

          <h4 className="text-3xl font-bold text-center text-slate-800 mb-12">What Leaders Are Saying:</h4>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-blue-600 shadow-lg">
              <CardContent className="p-8">
                <p className="text-lg italic text-slate-700 mb-4">
                  "I used to crash hard around 3 PM every day. Now my thinking stays sharp through evening board calls."
                </p>
                <p className="font-bold text-blue-700">– Sarah M., VP Strategy</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-600 shadow-lg">
              <CardContent className="p-8">
                <p className="text-lg italic text-slate-700 mb-4">
                  "The morning clarity checklist alone transformed how I show up to important meetings."
                </p>
                <p className="font-bold text-blue-700">– Marcus R., CEO</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="bg-amber-50 border-2 border-amber-300">
            <CardContent className="p-10 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Clock className="h-8 w-8 text-amber-600" />
                <h4 className="text-3xl font-bold text-slate-800">Why You Need This NOW:</h4>
              </div>
              <p className="text-lg text-slate-700 mb-6">
                Every day you delay is another day of making important decisions with a tired brain, missing strategic
                opportunities due to mental fog, and letting sharper competitors gain ground on you.
              </p>
              <p className="text-xl font-bold text-slate-800">
                Your next promotion, your next big deal, your legacy as a leader – they all depend on the quality of
                decisions you make when your brain is under pressure.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold mb-6">Your Decision-Making Quality Determines Your Legacy</h3>
          <p className="text-xl mb-4">
            The difference between good executives and great ones isn't talent – it's the quality of their
            decision-making under pressure.
          </p>
          <p className="text-2xl font-bold mb-12">That cognitive edge can be yours.</p>

          <Button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => {
                document.getElementById('email')?.focus();
              }, 1000);
            }}
            className="h-16 px-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <Brain className="h-6 w-6 mr-3" />
            GET MY FREE CLARITY SYSTEM
          </Button>

          <Card className="mt-12 bg-white/10 backdrop-blur-lg border-white/20 text-white max-w-4xl mx-auto">
            <CardContent className="p-8">
              <p className="text-lg">
                <strong>P.S.</strong> This simple 3-step system ensures you're always making choices from clarity, not
                fatigue. Get your free copy now and start building your competitive cognitive advantage today.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg mb-2">Trusted by executives at leading companies worldwide</p>
          <p className="text-slate-400 mb-6">No spam – just cognitive performance strategies that work</p>
          
          <div className="flex justify-center space-x-6">
            <a 
              href="https://www.youtube.com/@TheSharpExecutive" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="h-6 w-6" />
            </a>
            <a 
              href="https://x.com/TheSharpExecuti" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a 
              href="https://www.instagram.com/thesharpexecutive/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}