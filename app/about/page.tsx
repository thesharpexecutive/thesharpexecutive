import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Zap, AlertTriangle, Target, BarChart, ArrowRight, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'The Cognitive Performance Revolution for Executive Leaders - The Sharp Executive',
  description: 'Discover how we help executives maintain peak cognitive performance through science-based strategies and advanced brain training technologies.',
}

export default function AboutPage() {
  const problems = [
    'Million-dollar decisions made with a fatigued mind',
    'Strategic opportunities missed due to mental fog',
    'Leadership presence diminished by cognitive overload',
    'Competitive advantages lost to sharper competitors'
  ]

  const solutions = [
    'Neuroscience research from Harvard, Stanford, and Mayo Clinic',
    'Proven cognitive training protocols that enhance executive function',
    'Real-world implementation strategies for busy executive schedules',
    'Advanced brain training technologies',
    'Measurable performance improvements you can track and optimize'
  ]

  return (
    <div className="space-y-20 py-12 md:py-20">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          The Cognitive Performance Revolution for Executive Leaders
        </h1>
        <p className="mt-8 text-xl text-muted-foreground leading-relaxed">
          Your mind is your most valuable business asset. Are you training it like one?
        </p>
        <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-100 text-left">
          <p className="text-lg text-blue-900 mb-4">
            Every day, executives make thousands of decisions that shape companies, careers, and legacies. 
            Yet most leaders rely on outdated approaches—caffeine, willpower, and sheer determination—to maintain peak cognitive performance.
          </p>
          <h2 className="text-2xl font-bold text-blue-800">There's a better way.</h2>
          <p className="mt-4 text-blue-900">
            At The Sharp Executive, we've cracked the code on sustained cognitive excellence for business leaders. 
            Through cutting-edge research, proven methodologies, and advanced brain training technologies, 
            we help executives like you maintain razor-sharp thinking from morning strategy sessions to evening board calls.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">THE PROBLEM WE SOLVE</h2>
            <h3 className="text-2xl text-muted-foreground">The Hidden Crisis in Executive Performance</h3>
          </div>
          
          <div className="bg-background rounded-lg p-8 shadow-sm">
            <div className="text-center mb-8">
              <p className="text-5xl font-bold text-blue-600 mb-2">73%</p>
              <p className="text-lg">of executives show significant cognitive decline by 2 PM compared to their 9 AM baseline.</p>
            </div>
            
            <p className="text-center text-lg mb-8 font-medium">
              This isn't just about feeling tired. It's about:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {problems.map((problem, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{problem}</p>
                </div>
              ))}
            </div>
            
            <p className="text-center mt-12 text-xl font-medium">
              The cost of decision fatigue isn't measured in productivity—it's measured in legacy.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">OUR SOLUTION</h2>
            <h3 className="text-2xl text-muted-foreground">Science-Based Cognitive Enhancement for Executives</h3>
          </div>
          
          <div className="bg-background rounded-lg p-8 shadow-sm">
            <p className="text-center text-lg mb-8 max-w-3xl mx-auto">
              We don't offer generic productivity tips or motivational speeches. We provide scientifically-validated 
              cognitive enhancement strategies specifically designed for the unique demands of executive leadership.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="space-y-6">
                <h4 className="text-xl font-semibold">Our approach combines:</h4>
                <ul className="space-y-4">
                  {solutions.map((solution, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <span className="text-muted-foreground">{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 p-8 rounded-lg border border-blue-100">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6 mx-auto">
                  <Brain className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Experience the Difference</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Join the ranks of top executives who've transformed their cognitive performance and business results.
                </p>
                <div className="flex justify-center">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold mb-6">OUR MISSION</h2>
            <h3 className="text-2xl text-muted-foreground mb-8">
              Transforming Executive Performance Through Cognitive Excellence
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              We believe every executive deserves to operate at their cognitive peak—not just in the morning, but throughout their entire day.
            </p>
            <p className="text-lg text-muted-foreground">
              Our mission is simple: Help business leaders maintain the mental sharpness that got them to the top, so they can continue making decisions that matter, building companies that thrive, and leaving legacies that last.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
