import { useEffect, useState } from 'react';
import { IconCSV, IconExcel, IconSearch, IconSortOrder } from '../../../../assets/icons';
import { ButtonDefault } from '../../form/button-default';
import { Skeleton } from '../../loading/skeleton/styles';
import * as S from './styles'
import { SelectDefault } from '../../form/select-default';
import { generateCSVandExcel } from '../../../../core/utils/download';

interface IProps<T> {
    onSearch?(search: string): void;
    onSort?(value: string): void;
    onPaginate?(page: number): void;
    onLimit?(limit: number): void;
    getDataDownload: () => Promise<GetResponse<T>>;
    thead: ITHead[];
    tbody: React.ReactNode;
    download?: string;
    loading?: boolean;
    order?: string;
    pagination?: {
        page: number,
        limit: number,
        total: number
        total_show: number;
    }
}

export interface GetResponse<T> {
    data: T[];
    total: number;
}

interface ITHead {
    name: string,
    value: string;
    order?: boolean;
    width?: number;
}

export const TableDefault = <T,>({
    onSearch,
    getDataDownload,
    download,
    onPaginate,
    onLimit,
    onSort,
    order,
    pagination,
    loading,
    thead,
    tbody,
}: IProps<T>) => {

    const OPTIONS_LIMIT = [{
        name: '10 Registros',
        value: '10',
    },
    {
        name: '25 Registros',
        value: '25',
    },
    {
        name: '50 Registros',
        value: '50',
    },
    {
        name: '100 Registros',
        value: '100',
    }]

    const LIMIT_SELECTED = OPTIONS_LIMIT.find((obj) => Number(obj.value) === pagination?.limit);

    const [loadingDownload, setLoadingDownload] = useState<'' | 'CSV' | 'EXCEL'>('')

    const [pages, setPages] = useState<{ current: number, pages: number[], totalPages: number }>({
        current: 1,
        pages: [],
        totalPages: 0,
    })

    function generatePages({ page, limit, total }: { page: number, limit: number, total: number }) {
        const totalPages = Math.ceil(total / limit);

        let startPage = Math.max(1, page - 2);
        let endPage = Math.min(totalPages, page + 2);

        // Garante até 7 páginas no range
        if (endPage - startPage < 3) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 3);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - 3);
            }
        }

        return {
            current: page,
            pages: Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i),
            totalPages
        };
    }

    useEffect(() => {
        if (pagination) {
            const generate = generatePages({ ...pagination });
            setPages({ ...generate })
        }
    }, [pagination])

    const handleDownload = async (type: 'CSV' | 'EXCEL') => {
        setLoadingDownload(type);
        const response: any = await getDataDownload();
        const data = response.items;
        const { downloadCSV, downloadExcel } = generateCSVandExcel(thead, data, download);
        if (type === 'CSV') {
            downloadCSV();
        } else if (type === 'EXCEL') {
            downloadExcel();
        }
        setLoadingDownload('');
    }

    return (
        <S.Container>


            <div className='head-table'>
                {onSearch &&
                    <div className='search'>
                        <input placeholder='Buscar' onBlur={(e) => onSearch(e.target.value)} />
                        <button type='button'><IconSearch /></button>
                    </div>
                }
                {(download) &&
                    <div className='buttons'>
                        <ButtonDefault loading={loadingDownload === 'EXCEL' ? true : false} variant='success' icon={<IconExcel />} onClick={() => handleDownload('EXCEL')}>
                            Exportar EXCEL
                        </ButtonDefault>
                        <ButtonDefault disabled={loadingDownload !== '' ? true : false} loading={loadingDownload === 'CSV' ? true : false} variant='light' icon={<IconCSV />} onClick={() => handleDownload('CSV')}>
                            Exportar CSV
                        </ButtonDefault>
                    </div>
                }
            </div>

            <div className='overflow-table'>
                <table>
                    <thead>
                        <tr>
                            {thead.map((th, index) =>
                                <th style={{ width: th.width ?? 'auto' }} key={`th-${index}-${th.value}`}>
                                    <div className='th-flex'>
                                        <span>
                                            {th.name}
                                        </span>
                                        {th.order &&
                                            <button onClick={() => (onSort && th.order === true) ? onSort(th.value === order ? `-${th.value}` : th.value) : null}>
                                                <IconSortOrder sort={`-${th.value}` === order ? 'asc' : th.value === order ? 'desc' : 'all'} />
                                            </button>
                                        }
                                    </div>
                                </th>
                            )}
                        </tr>
                    </thead>

                    {loading &&
                        <tbody>
                            {Array.from({ length: pagination?.limit ?? 5 }).map((_) => (
                                <tr>
                                    {thead.map((td, index) =>
                                        <td key={`td-load-${index}-${td.value}`}>
                                            <div style={{ display: 'flex', width: '100%', padding: '9px 0px' }}>
                                                <Skeleton widthAuto={true} height='17px' />
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>}
                    {!loading && tbody}


                    {!loading && pagination?.total === 0 &&
                        <tbody>
                            <tr>
                                <td colSpan={thead.length}>
                                    <div style={{padding: '20px 10px'}}>
                                        Nenhum registro encontrado.
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    }
                </table>
            </div>

            {pagination?.total ?
                <div className='foot'>
                    <div className='left'>
                        {loading ?
                            <Skeleton width='200px' height='18px' />
                            :
                            <span className='total'>
                                Mostrando <b>{pagination.total_show}</b> de um total de <b>{pagination.total}</b>
                            </span>
                        }
                    </div>
                    <div className='right'>
                        {onPaginate &&
                            <div className='paginte'>

                                <button onClick={() => pages.current - 1 !== 0 ? onPaginate(Number(pages.current - 1)) : null}>Anterior</button>

                                {pages.pages.filter((obj) => obj === 1).length === 0 &&
                                    <button onClick={() => onPaginate(Number(1))}>Primeira</button>
                                }

                                {pages.pages.map((page) =>
                                    <button className={`${page === pages.current ? 'active' : 'normal'}`} onClick={() => onPaginate(Number(page))} key={`pgn-page-${page}`}>{page}</button>
                                )}

                                {pages.pages.filter((obj) => obj === pages.totalPages).length === 0 &&
                                    <button onClick={() => onPaginate(Number(pages.totalPages))}>Última</button>
                                }

                                <button onClick={() => pages.current + 1 !== pages.totalPages ? onPaginate(Number(pages.current + 1)) : null}>Próxima</button>
                            </div>
                        }
                        {onLimit &&
                            <SelectDefault
                                options={OPTIONS_LIMIT}
                                onChange={(value) => onLimit(Number(value.value))}
                                value={{
                                    name: LIMIT_SELECTED?.name ?? '10 Registros',
                                    value: LIMIT_SELECTED?.value ?? '10'
                                }}
                            />
                        }
                    </div>
                </div>
                : null}


        </S.Container >
    )
}