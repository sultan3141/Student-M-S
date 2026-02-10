export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/images/logo.png"
            alt="Darul-Ulum Logo"
            className={props.className || "h-16 w-16 object-contain"}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://ui-avatars.com/api/?name=Darul+Ulum&background=0F172A&color=fff";
            }}
        />
    );
}
