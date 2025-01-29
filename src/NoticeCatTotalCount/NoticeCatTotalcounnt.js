import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const NoticeCatTotalcounnt = () => {
    const [categories, setCategories] = useState([
        { name: "Legal Notice", notes: 400 },
        { name: "Planning Applications", notes: 480 },
        { name: "Government Notice", notes: 460 },
        { name: "Financial Notice", notes: 480 },
        { name: "Environmental Notice", notes: 480 },
    ]);
    return (

        <>
            <div className="grid grid-cols-5 gap-4 mt-10">
                <div className="col-span-3 text-black">Total Notice Section Graph</div>

                {/* Category Section */}
                <div className="p-6 bg-white rounded-[26.667px] border border-[rgba(0,75,128,0.30)] shadow-md w-[320px] ml-10">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Notices by category</h2>

                    {categories.map((category, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg mb-2 border-l-4 border-blue-600">
                            <span className="text-gray-700 text-sm">{category.name}</span>
                            <span className="text-gray-900 font-semibold">{category.notes}</span>
                        </div>
                    ))}

                    <div className="mt-4 flex items-center text-blue-600 font-medium hover:underline cursor-pointer">
                        View all Categories <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                </div>

            </div>

        </>
    )
}

export default NoticeCatTotalcounnt