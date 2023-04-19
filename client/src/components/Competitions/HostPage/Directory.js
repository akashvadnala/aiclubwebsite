import { useState } from "react";

const Directory = ({ files, order }) => {
    const [isExpanded, toggleExpanded] = useState(false);
    if (files.type === 'folder') {
        return (
            <div className="dir border-top">
                <p className={`dir-title mb-2 pt-2 ${isExpanded?"fw-bolder":""}`} style={{ paddingLeft: `${order * 20}px` }} onClick={() => toggleExpanded(!isExpanded)}>
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                            <g id="File / Folder">
                                <path id="Vector" d="M3 6V16.8C3 17.9201 3 18.4798 3.21799 18.9076C3.40973 19.2839 3.71547 19.5905 4.0918 19.7822C4.5192 20 5.07899 20 6.19691 20H17.8031C18.921 20 19.48 20 19.9074 19.7822C20.2837 19.5905 20.5905 19.2841 20.7822 18.9078C21.0002 18.48 21.0002 17.9199 21.0002 16.7998L21.0002 9.19978C21.0002 8.07967 21.0002 7.51962 20.7822 7.0918C20.5905 6.71547 20.2839 6.40973 19.9076 6.21799C19.4798 6 18.9201 6 17.8 6H12M3 6H12M3 6C3 4.89543 3.89543 4 5 4H8.67452C9.1637 4 9.40886 4 9.63904 4.05526C9.84311 4.10425 10.0379 4.18526 10.2168 4.29492C10.4186 4.41857 10.5918 4.59182 10.9375 4.9375L12 6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                        </svg>
                        &nbsp;{files.name}
                    </>
                </p>
                {
                    isExpanded && files.items.map((item) => <Directory files={item} order={order + 1} />)
                }
            </div>
        )
    }
    return (
        <>
            <p className={`file-name mb-2 pt-2 border-top ${isExpanded?"fw-bolder":""}`} style={{ paddingLeft: `${order * 20}px` }} >
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 400 400">
                        <g id="xxx-file">
                            <path class="cls-1" d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,0,1,10,0V95h70a5,5,0,0,1,0,10Z" />
                            <path class="cls-1" d="M300,380H100a30,30,0,0,1-30-30V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100V350A30,30,0,0,1,300,380ZM100,30A20,20,0,0,0,80,50V350a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V102.07L247.93,30Z" />
                            <path class="cls-1" d="M275,180H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />
                            <path class="cls-1" d="M275,230H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />
                            <path class="cls-1" d="M275,280H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z" />
                            <path class="cls-1" d="M200,330H125a5,5,0,0,1,0-10h75a5,5,0,0,1,0,10Z" />
                        </g>
                    </svg>
                    &nbsp;{files.name}
                </>
            </p>
        </>
    )
}
export default Directory;