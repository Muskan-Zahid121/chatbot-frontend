import React from 'react'
import { Card } from '@/components/ui/card'
import { Briefcase, User, Cpu, Cloud, Wrench, Code2, Rocket } from 'lucide-react'

const SectionTitle: React.FC<{ icon: React.ElementType; title: string }> = ({ icon: Icon, title }) => (
  <h3 className="text-xl font-bold text-brand mb-4 flex items-center">
    <Icon className="w-6 h-6 mr-3 text-brand" />
    {title}
  </h3>
)

const Badge: React.FC<{ label: string }> = ({ label }) => (
  <span className="px-3 py-1 bg-brand-soft border border-brand text-brand text-xs rounded-full font-medium">
    {label}
  </span>
)

const Profile: React.FC = () => {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-brand-soft shadow-sm flex-shrink-0">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-brand">Profile</h1>
                <p className="text-lg text-brand/70 font-medium">About, skills, and professional experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-[#fafafa]">
        <div className="max-w-8xl mx-auto px-4 py-3 space-y-6">
          <Card className=" bg-white border border-brand shadow-sm">
            <h1 className="text-brand leading-relaxed text-center font-bold text-2xl mb-1">
            Muskan Zahid - Full Stack AI Engineer
            </h1>
          </Card>
          {/* About */}
          <Card className="p-6 bg-white border border-brand shadow-sm">
            <SectionTitle icon={User} title="About" />
            <p className="text-brand/90 leading-relaxed">
              Passionate Full-Stack Developer with a focus on AI and automation. Experienced in building intelligent chatbots, implementing
              document web scraping, and leveraging chunk embeddings for efficient data processing. Proficient in React, Node.js, and PostgreSQL,
              with expertise in integrating AI models and optimizing system performance. Constantly exploring new technologies to create scalable,
              high-performance applications that enhance user experience and business efficiency. Always eager to learn, innovate, and contribute to
              impactful projects.
            </p>
          </Card>

          {/* Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border border-brand shadow-sm">
              <SectionTitle icon={Code2} title="Frontend Development" />
              <p className="text-sm text-brand/80 mb-4">
                Building responsive, accessible user interfaces with modern frameworks and tools. Specializing in creating intuitive user
                experiences with clean, maintainable code.
              </p>
              <div className="flex flex-wrap gap-2">
                {['React.js','TypeScript','Tailwind CSS','Material UI','Shadcn/ui'].map((t) => (
                  <Badge key={t} label={t} />
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white border border-brand shadow-sm">
              <SectionTitle icon={Wrench} title="Backend Systems" />
              <p className="text-sm text-brand/80 mb-4">
                Robust server-side architecture and data management with scalable solutions. Building secure, high-performance APIs and database systems.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Node.js','Express.js','PostgreSQL','RESTful APIs','GraphQL'].map((t) => (
                  <Badge key={t} label={t} />
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white border border-brand shadow-sm">
              <SectionTitle icon={Cpu} title="AI & Machine Learning" />
              <p className="text-sm text-brand/80 mb-4">
                Intelligent systems and natural language processing with cutting-edge AI technologies. Implementing advanced machine learning solutions.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Langchain','OpenAI','RAG Architecture','Vector Databases','NLP'].map((t) => (
                  <Badge key={t} label={t} />
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white border border-brand shadow-sm">
              <SectionTitle icon={Cloud} title="DevOps & Cloud" />
              <p className="text-sm text-brand/80 mb-4">
                Scalable deployment and infrastructure management with cloud-native solutions. Ensuring reliable, secure, and efficient deployments.
              </p>
              <div className="flex flex-wrap gap-2">
                {['AWS (EC2, S3)','Docker','GitHub','CI/CD','Monitoring'].map((t) => (
                  <Badge key={t} label={t} />
                ))}
              </div>
            </Card>
          </div>

          {/* Experience */}
          <Card className="p-6 bg-white border border-brand shadow-sm">
            <SectionTitle icon={Briefcase} title="Experience" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-brand">Cyberify — Full Stack Web Developer (React + Node.js)</p>
                  <p className="text-sm text-brand/70">Dec 2024 - Present • On-site</p>
                </div>
                <span className="px-3 py-1 text-xs rounded-full bg-brand-soft text-brand border border-brand">Current</span>
              </div>
              <p className="text-brand/90">
                Leading the development of scalable web applications with seamless AI integrations. Specializing in React, Node.js, and PostgreSQL,
                while optimizing system performance and developing dynamic user interfaces. Continuously exploring new technologies to enhance user
                experience and business efficiency.
              </p>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-brand mb-2 flex items-center"><Rocket className="w-4 h-4 mr-2" />Key Achievements</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-brand/90">
                  <li>Built scalable web applications with AI integrations</li>
                  <li>Optimized system performance by 40%</li>
                  <li>Developed dynamic user interfaces</li>
                  <li>Implemented continuous integration practices</li>
                </ul>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-brand mb-2 flex items-center"><Wrench className="w-4 h-4 mr-2" />Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {['React.js','Node.js','PostgreSQL','AI Integration','Performance Optimization'].map((t) => (
                    <Badge key={t} label={t} />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile


