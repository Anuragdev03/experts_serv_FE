import ExpertHeader from "../features/dashboard/Header";
import "./styles/style.css"
interface LayoutProps {
    children: React.ReactNode
}

export default function ExpertLayout({children}: LayoutProps) {
    return (
        <div>
            <ExpertHeader />
            <div className="layout-wrapper">
                <main>
                    {children}
                </main>
            </div>
        </div>
    )
}

