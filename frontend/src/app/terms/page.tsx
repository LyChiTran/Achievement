"use client";

import { FileText } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <header className="border-b glass">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/" className="text-purple-600 hover:text-purple-700 font-bold text-xl">
                        ← Back
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="flex items-center gap-3 mb-8">
                    <FileText className="w-10 h-10 text-purple-600" />
                    <h1 className="text-4xl font-bold">Terms of Service</h1>
                </div>

                <div className="glass rounded-xl p-8 space-y-6 text-gray-700">
                    <p className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleDateString('en-US')}
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Achievement Web, you agree to comply with these terms.
                            If you do not agree, please do not use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">2. Service Description</h2>
                        <p>Achievement Web is a personal achievement management platform that allows you to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Create and track achievements</li>
                            <li>Manage skills and goals</li>
                            <li>Organize by categories</li>
                            <li>View timeline and analytics</li>
                            <li>Share public achievements (optional)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">3. User Accounts</h2>
                        <p className="mb-2">When creating an account, you agree to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide accurate and complete information</li>
                            <li>Secure your login credentials</li>
                            <li>Take responsibility for all account activity</li>
                            <li>Notify us immediately of unauthorized access</li>
                            <li>Maintain only one account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">4. Usage Rules</h2>
                        <p className="mb-2">You <strong>MAY NOT</strong>:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Post illegal, offensive, or inappropriate content</li>
                            <li>Spam or harass other users</li>
                            <li>Attack, hack, or disrupt the system</li>
                            <li>Use unauthorized bots or automation tools</li>
                            <li>Collect data from other users</li>
                            <li>Impersonate others</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">5. Content Ownership</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Your content:</strong> You retain ownership of achievements and data you create</li>
                            <li><strong>License:</strong> You grant us the right to display and store your content</li>
                            <li><strong>Public content:</strong> Achievements marked "public" can be viewed by everyone</li>
                            <li><strong>Deletion:</strong> You may delete your content at any time</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">6. Intellectual Property</h2>
                        <p>
                            Achievement Web and all components (design, code, logo, etc.) are our property.
                            You may not copy, distribute, or create derivative works.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">7. Liability Disclaimer</h2>
                        <p>Achievement Web is provided "AS IS":</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>No guarantee of 100% uptime</li>
                            <li>Not responsible for data loss (backup recommended)</li>
                            <li>Not liable for indirect damages</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">8. Service Termination</h2>
                        <p>We reserve the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Suspend or delete accounts that violate these terms</li>
                            <li>Modify or discontinue the service</li>
                            <li>No refunds (if fees apply in future)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">9. Changes to Terms</h2>
                        <p>
                            We may update these terms. Significant changes will be announced at least 30 days in advance.
                            Continued use after changes means you accept the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">10. Governing Law</h2>
                        <p>
                            These terms are governed by applicable laws.
                            Any disputes will be resolved in courts of competent jurisdiction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">11. Contact</h2>
                        <p>If you have questions about these terms:</p>
                        <p className="mt-2">
                            <strong>Email:</strong> support@achievementweb.com<br />
                            <strong>Developer:</strong> Ly Chi Tran
                        </p>
                    </section>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/register" className="text-purple-600 hover:underline font-semibold">
                        Back to Registration →
                    </Link>
                </div>
            </div>
        </div>
    );
}
