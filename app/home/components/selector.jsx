import React from 'react';
const Selector = () => {
    return (
        <div>
            <form className="max-w-sm mx-auto">
                <select id="countries" className="font-josefin font-normal bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[20rem] pr-5 py-3  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">Choose Type</option>
                    <option value="action">Action</option>
                    <option value="race">Race</option>
                    <option value="fight">Fight</option>
                    <option value="adventure">Adventure</option>
                </select>
            </form>
        </div>
    )
}

export default Selector;
