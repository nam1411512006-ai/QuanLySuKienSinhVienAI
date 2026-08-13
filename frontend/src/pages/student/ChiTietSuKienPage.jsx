import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import suKienService from "../../services/suKienService";

import ThongTinSuKien from "../../components/event/ThongTinSuKien";
import SuKienLienQuan from "../../components/event/SuKienLienQuan";

const ChiTietSuKienPage = () => {

    const { id } = useParams();

    const [suKien, setSuKien] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadData = async () => {

            try {

                const res = await suKienService.getById(id);

                console.log("Response API:", res);

                setSuKien(res);


            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, [id]);

    if (loading) {

        return <h2>Đang tải...</h2>;

    }

    if (!suKien) {

        return <h2>Không tìm thấy sự kiện</h2>;

    }

    return (
        <>
            <ThongTinSuKien suKien={suKien} />

            <SuKienLienQuan />
        </>
    );

};

export default ChiTietSuKienPage;