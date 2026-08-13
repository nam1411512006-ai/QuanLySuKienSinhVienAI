import CardSuKien from "./CardSuKien";

const SuKienLienQuan = () => {

    return (

        <>

            <h2 className="section-title">
                Sự kiện liên quan
            </h2>

            <div className="event-grid">

                <CardSuKien
                    id={4}
                    ten="Workshop AI"
                    ngay="28/08/2026"
                    diaDiem="B201"
                    diem="8"
                />

                <CardSuKien
                    id={5}
                    ten="Ngày hội CNTT"
                    ngay="05/09/2026"
                    diaDiem="Nhà đa năng"
                    diem="15"
                />

                <CardSuKien
                    id={6}
                    ten="Talkshow Startup"
                    ngay="10/09/2026"
                    diaDiem="Hội trường B"
                    diem="12"
                />

            </div>

        </>

    );

};

export default SuKienLienQuan;