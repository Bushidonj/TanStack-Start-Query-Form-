import { createFileRoute } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import doc from '../docs/backlog.md?raw';

export const Route = createFileRoute('/docs')({
    component: DocsPage,
})

function DocsPage() {
    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-notion-text">Documentação</h1>
            <div className="p-8 border border-notion-border rounded-xl bg-notion-sidebar/50">
                {/* Render markdown file contents with a Notion-like feel */}
                <ReactMarkdown
                    remarkPlugins={[gfm]}
                    components={{
                        h1: ({node, ...props}) => (
                            <h1 className="text-3xl font-bold text-notion-text mt-6 mb-4" {...props} />
                        ),
                        h2: ({node, ...props}) => (
                            <h2 className="text-2xl font-semibold text-notion-text mt-5 mb-3" {...props} />
                        ),
                        h3: ({node, ...props}) => (
                            <h3 className="text-xl font-semibold text-notion-text mt-4 mb-2" {...props} />
                        ),
                        p: ({node, ...props}) => (
                            <p className="text-notion-text-muted leading-relaxed mb-2" {...props} />
                        ),
                        li: ({node, ordered, ...props}) => (
                            <li className={ordered ? 'ml-6 list-decimal' : 'ml-6 list-disc'} {...props} />
                        ),
                        strong: ({node, ...props}) => (
                            <strong className="font-semibold text-notion-text" {...props} />
                        ),
                        em: ({node, ...props}) => (
                            <em className="italic text-notion-text" {...props} />
                        ),
                        a: ({node, ...props}) => (
                            <a className="text-blue-500 hover:underline" {...props} />
                        ),
                    }}
                >
                    {doc}
                </ReactMarkdown>
            </div>
        </div>
    )
}
