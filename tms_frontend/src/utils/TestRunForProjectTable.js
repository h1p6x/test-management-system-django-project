import React, {useState} from 'react';
import {Pagination, Table, Tag} from "antd";
import {Link} from "react-router-dom";

function TestRunForProjectTable(props) {
    const {testCase, testRun, loading} = props;
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const sortedTestRun = [...testRun].sort((a, b) => b.id - a.id);

    const handlePaginationChange = (page) => {
        setCurrentPage(page);
    };


    return (
        <div>
            <Table
                columns={[
                    {
                        title: "Название тестового запуска",
                        dataIndex: "name",
                        ellipsis: true,
                        render: (text, {id}) => {
                            return (
                                <Link to={`./testruns/${id}`} style={{textDecoration: "none"}}>
                                    {text}
                                </Link>
                            );
                        }

                    },
                    {
                        title: "Описание",
                        dataIndex: "description",
                        ellipsis: true,
                    },
                    {
                        title: "Прикрепленные к тестовуму запуски тест-кейсы",
                        dataIndex: "testcases",
                        render: (_, {testcases}) => (
                            <>
                                {testcases.map((tag) => {
                                    let color = tag.length > 5 ? 'geekblue' : 'green';
                                    return testCase
                                        .filter(value => value.value === tag)
                                        .map(value => (
                                            <Tag color={color} key={value.value}>
                                                {value.label}
                                            </Tag>
                                        ));
                                })}
                            </>
                        ),

                    }
                ]}
                loading={loading}
                dataSource={sortedTestRun.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize
                )}
                pagination={false}
                size="large"
                style={{ minHeight: "400px", overflowY: "scroll" }}
            ></Table>
            <div style={{ marginTop: "16px", textAlign: "right" }}>
                <Pagination
                    current={currentPage}
                    total={sortedTestRun.length}
                    pageSize={pageSize}
                    onChange={handlePaginationChange}
                />
            </div>
        </div>
    );
    // return (
    //     <div style={{position: "relative", height: "100%"}}>
    //         <div style={{position: "relative", height: "calc(100% - 50px)"}}>
    //             <div style={{overflowY: "auto", height: "100%"}}>
    //                 <div style={{height: "calc(100% - 48px)"}}>
    //                     <Table
    //                         columns={[
    //                             {
    //                                 title: "Название тестового запуска",
    //                                 dataIndex: "name",
    //                                 ellipsis: true,
    //                                 render: (text, {id}) => {
    //                                     return (
    //                                         <Link to={`./testruns/${id}`} style={{textDecoration: "none"}}>
    //                                             {text}
    //                                         </Link>
    //                                     );
    //                                 }
    //                             },
    //                             {
    //                                 title: "Описание",
    //                                 dataIndex: "description",
    //                                 ellipsis: true,
    //                             },
    //                             {
    //                                 title: "Прикрепленные к тестовому запуску тест-кейсы",
    //                                 dataIndex: "testcases",
    //                                 render: (_, {testcases}) => (
    //                                     <>
    //                                         {testcases.map((tag) => {
    //                                             let color = tag.length > 5 ? 'geekblue' : 'green';
    //                                             return testCase
    //                                                 .filter(value => value.value === tag)
    //                                                 .map(value => (
    //                                                     <Tag color={color} key={value.value}>
    //                                                         {value.label}
    //                                                     </Tag>
    //                                                 ));
    //                                         })}
    //                                     </>
    //                                 ),
    //                             }
    //                         ]}
    //                         loading={loading}
    //                         dataSource={sortedTestRun}
    //                         // pagination={{
    //                         //     pageSize: 5,
    //                         //     style: {
    //                         //         position: "sticky",
    //                         //         bottom: 0,
    //                         //         right: 0,
    //                         //         zIndex: 1,
    //                         //         backgroundColor: "#fff",
    //                         //         width: "100%"
    //                         //     },
    //                         //     showSizeChanger: false,
    //                         //     showQuickJumper: false,
    //                         //     simple: true,
    //                         // }}
    //                         pagination={{
    //                             current: pagination.current,
    //                             pageSize: pagination.pageSize,
    //                             onChange: handlePaginationChange,
    //                             style: {
    //                                 position: "sticky",
    //                                 bottom: 0,
    //                                 right: 0,
    //                                 zIndex: 1,
    //                                 backgroundColor: "#fff",
    //                                 width: "100%"
    //                             },
    //                             showSizeChanger: false,
    //                             showQuickJumper: false,
    //                             simple: true,
    //                         }}
    //                         size="large"
    //                         scroll={{y: "100%"}}
    //                         style={{height: "100%", minHeight: 0}}
    //                     />
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
}

// import React from "react";
// import { Link } from "react-router-dom";
// import { Table, Tag } from "antd";
//
// function TestRunForProjectTable(props) {
//     const { testCase, testRun, loading } = props;
//     const sortedTestRun = [...testRun].sort((a, b) => b.id - a.id);
//     const [currentPage, setCurrentPage] = React.useState(1);
//     const pageSize = 5;
//
//     const handlePaginationChange = (page) => {
//         setCurrentPage(page);
//     };
//
//     const renderPagination = () => {
//         const totalItems = sortedTestRun.length;
//         const totalPages = Math.ceil(totalItems / pageSize);
//
//         return (
//             <div style={{ textAlign: "center", marginTop: "16px" }}>
//         <span>
//           {currentPage} / {totalPages}
//         </span>
//                 <button
//                     disabled={currentPage === 1}
//                     onClick={() => handlePaginationChange(currentPage - 1)}
//                     style={{ marginLeft: "8px", marginRight: "8px" }}
//                 >
//                     Previous
//                 </button>
//                 <button
//                     disabled={currentPage === totalPages}
//                     onClick={() => handlePaginationChange(currentPage + 1)}
//                 >
//                     Next
//                 </button>
//             </div>
//         );
//     };
//
//     return (
//         <div style={{ position: "relative" }}>
//             <h1 style={{ minHeight: "50px" }}>Название таблицы</h1>
//             <div style={{ position: "relative", flex: 1 }}>
//                 <div style={{ overflowY: "auto", flex: 1 }}>
//                     <div style={{ minHeight: 0 }}>
//                         <Table
//                             columns={[
//                                 {
//                                     title: "Название тестового запуска",
//                                     dataIndex: "name",
//                                     ellipsis: true,
//                                     render: (text, { id }) => {
//                                         return (
//                                             <Link
//                                                 to={`./testruns/${id}`}
//                                                 style={{ textDecoration: "none" }}
//                                             >
//                                                 {text}
//                                             </Link>
//                                         );
//                                     },
//                                 },
//                                 {
//                                     title: "Описание",
//                                     dataIndex: "description",
//                                     ellipsis: true,
//                                 },
//                                 {
//                                     title: "Прикрепленные к тестовому запуску тест-кейсы",
//                                     dataIndex: "testcases",
//                                     render: (_, { testcases }) => (
//                                         <>
//                                             {testcases.map((tag) => {
//                                                 let color = tag.length > 5 ? "geekblue" : "green";
//                                                 return testCase
//                                                     .filter((value) => value.value === tag)
//                                                     .map((value) => (
//                                                         <Tag color={color} key={value.value}>
//                                                             {value.label}
//                                                         </Tag>
//                                                     ));
//                                             })}
//                                         </>
//                                     ),
//                                 },
//                             ]}
//                             loading={loading}
//                             dataSource={sortedTestRun.slice(
//                                 (currentPage - 1) * pageSize,
//                                 currentPage * pageSize
//                             )}
//                             pagination={false}
//                             size="large"
//                             scroll={{ y: "100%" }}
//                             style={{ height: "100%", minHeight: 0 }}
//                         />
//                     </div>
//                 </div>
//             </div>
//             {renderPagination()}
//         </div>
//     );
// }

export default TestRunForProjectTable;