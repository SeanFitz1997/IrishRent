import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import InputBase from "@material-ui/core/InputBase";
import InputAdornment from "@material-ui/core/InputAdornment";
import Autocomplete, {
	createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
import HomeIcon from "@material-ui/icons/Home";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import {
	Location,
	AllLocationsRecord,
} from "../../lib/RentData/RentData_interfaces";
import { getLocationName } from "../../lib/Utils";

// Constants
const ACCOUNT_ACTIONS_MENU_ID = "users-actions-menu";
const MOBILE_ACTIONS_MENU_ID = "mobile-actions-menu";
const SEARCH_BAR_PLACEHOLDER = "Search Location…";

// Styles Definition
const useStyles = makeStyles((theme) => ({
	grow: { flexGrow: 1 },
	logo: {
		display: "none",
		[theme.breakpoints.up("sm")]: {
			display: "block",
			height: "2.5em",
			margin: theme.spacing(1.5),
		},
		[theme.breakpoints.up("md")]: {
			marginLeft: theme.spacing(6),
			marginRight: theme.spacing(6),
		},
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		"&:hover": { backgroundColor: fade(theme.palette.common.white, 0.25) },
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(3),
			width: "60%",
		},
		[theme.breakpoints.up("md")]: {
			marginLeft: theme.spacing(3),
			width: "35%",
		},
	},
	inputRoot: {
		color: "inherit",
		width: "100%",
	},
	adornment: { marginLeft: theme.spacing(2) },
	navLink: {
		marginRight: theme.spacing(4),
		textTransform: "capitalize",
	},
	linksDesktop: {
		display: "none",
		[theme.breakpoints.up("md")]: {
			display: "flex",
			marginLeft: theme.spacing(6),
			marginRight: theme.spacing(6),
		},
	},
	linksMobile: {
		display: "flex",
		[theme.breakpoints.up("md")]: { display: "none" },
	},
	menuItem: { marginLeft: theme.spacing(2) },
}));

export default function Header({
	locations,
}: {
	locations: AllLocationsRecord;
}) {
	// Styles
	const classes = useStyles();

	// State
	/* the element that the menu is anchored to */
	const [
		accountActionsAnchorElement,
		setAccountActionsAnchorElement,
	] = useState(null);
	const [mobileMenuAnchorElement, setMobileMenuAnchorElement] = useState(
		null
	);

	const isAccountActionsMenuOpen = Boolean(accountActionsAnchorElement);
	const isMobileMenuOpen = Boolean(mobileMenuAnchorElement);

	// Event Handlers
	const handleAccountActionsOpen = (e) => {
		setAccountActionsAnchorElement(e.currentTarget);
	};
	const handleMobileMenuOpen = (e) => {
		setMobileMenuAnchorElement(e.currentTarget);
	};
	const closeMenus = () => {
		setAccountActionsAnchorElement(null);
		setMobileMenuAnchorElement(null);
	};

	return (
		<div>
			<AppBar position="static">
				<Toolbar>
					{/* Logo */}
					<Link href="/">
						<a>
							<img
								className={classes.logo}
								src="/images/icon/full_logo.svg"
								alt="Irishrent.ie Logo"
							/>
						</a>
					</Link>

					{/* Search Bar */}
					<SearchBar locations={locations} />

					{/* Add Space*/}
					<div className={classes.grow} />

					{/* Desktop Links */}
					<div className={classes.linksDesktop}>
						<Link href="/location">
							<Button
								className={classes.navLink}
								color="secondary"
							>
								Locations
							</Button>
						</Link>

						<Link href="/#about">
							<Button
								className={classes.navLink}
								color="secondary"
							>
								About
							</Button>
						</Link>

						{/* 
							(UNCOMMENT TO ADD USER ACCOUNT ACTIONS)
							<IconButton
								edge="end"
								aria-label="user account actions"
								aria-haspopup="true"
								color="inherit"
								aria-controls={ACCOUNT_ACTIONS_MENU_ID}
								onClick={handleAccountActionsOpen}
							>
								<AccountCircle style={{ fontSize: 30 }} />
							</IconButton> 
						*/}
					</div>

					{/* Mobile Links Menu */}
					<div className={classes.linksMobile}>
						<IconButton
							color="inherit"
							aria-label="show more"
							aria-haspopup="true"
							aria-controls={MOBILE_ACTIONS_MENU_ID}
							onClick={handleMobileMenuOpen}
						>
							<MoreIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>

			{/* Account Actions Menu (Desktop) */}
			{/* UNCOMMENT TO ADD USER ACTIONS 
			<HeaderMenu
				anchorElement={accountActionsAnchorElement}
				id={ACCOUNT_ACTIONS_MENU_ID}
				isOpen={isAccountActionsMenuOpen}
				handelClose={closeMenus}
				items={[
					{ Icon: PersonIcon, label: "Log in" },
					{ Icon: PersonAddIcon, label: "Register" },
				]}
			/> 
			*/}

			{/* All Actions Menu (Mobile) */}
			<HeaderMenu
				anchorElement={mobileMenuAnchorElement}
				id={MOBILE_ACTIONS_MENU_ID}
				isOpen={isMobileMenuOpen}
				handelClose={closeMenus}
				items={[
					{
						Icon: HomeIcon,
						label: "Home",
						href: "/",
					},
					{
						Icon: LocationCityIcon,
						label: "Locations",
						href: "/location",
					},
					{
						Icon: ContactSupportIcon,
						label: "About",
						href: "/#about",
					},
					// UNCOMMENT TO ADD ACCOUNT ACTIONS
					// { Icon: PersonIcon, label: "Log in" },
					// { Icon: PersonAddIcon, label: "Register" },
				]}
			/>
		</div>
	);
}

// Render Helpers
function HeaderMenu({ anchorElement, id, isOpen, handelClose, items }) {
	const classes = useStyles();

	return (
		<Menu
			anchorEl={anchorElement}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			id={id}
			keepMounted
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isOpen}
			onClose={handelClose}
		>
			{items.map(({ Icon, label, href }, i) => (
				<MenuItem key={i} onClick={handelClose}>
					<Link href={href}>
						<IconButton color="inherit">
							<Icon aria-label={label} />
							<Typography
								className={classes.menuItem}
								variant="body1"
							>
								{label}
							</Typography>
						</IconButton>
					</Link>
				</MenuItem>
			))}
		</Menu>
	);
}

function SearchBar({ locations }: { locations: AllLocationsRecord }) {
	// Styles
	const classes = useStyles();

	// State
	const options = [
		...locations.counties,
		...locations.postcodes,
		...locations.towns,
	];
	const filterOptions = createFilterOptions({
		matchFrom: "start",
		trim: true,
		limit: 5,
	});
	const [inputValue, setInputValue] = useState("");

	// Handlers
	const handelSearch = (value) => {
		try {
			const locationID = getLocationName(value);
			Router.push("/location/[id]", `/location/${locationID}`);
		} catch (error) {
			console.warn(`Unable to find location (${JSON.stringify(value)})`);
		}
	};

	// Render Helper
	const SuggestionRender = ({ option, inputValue }) => {
		const locationName = getLocationName(option);
		const matches = match(locationName, inputValue);
		const parts = parse(locationName, matches);
		return (
			<div>
				{parts.map((part, i) => (
					<span
						key={i}
						style={{ fontWeight: part.highlight ? 700 : 400 }}
					>
						{part.text}
					</span>
				))}
			</div>
		);
	};

	// Render
	return (
		<Autocomplete
			className={classes.search}
			freeSolo
			blurOnSelect
			onChange={(e, value) => handelSearch(value)}
			options={inputValue.length > 0 ? options : []}
			onInputChange={(e, newInput) => setInputValue(newInput)}
			getOptionLabel={(option: Location) =>
				typeof option === "string" ? option : getLocationName(option)
			}
			groupBy={(option: Location) => option.locationType}
			filterOptions={filterOptions}
			renderInput={(params) => (
				<InputBase
					startAdornment={
						<InputAdornment
							position="start"
							className={classes.adornment}
						>
							<SearchIcon />
						</InputAdornment>
					}
					ref={params.InputProps.ref}
					inputProps={params.inputProps}
					placeholder={SEARCH_BAR_PLACEHOLDER}
					autoFocus
					classes={{ root: classes.inputRoot }}
				/>
			)}
			renderOption={(option: Location, { inputValue }) => (
				<SuggestionRender option={option} inputValue={inputValue} />
			)}
		/>
	);
}
